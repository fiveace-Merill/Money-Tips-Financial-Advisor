import type { AiConfig } from "./config";

export type OpenRouterMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export class OpenRouterError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "OpenRouterError";
  }
}

function safeErrorMessage(status: number): string {
  if (status === 401) {
    return "AI provider authentication failed. Check the server configuration.";
  }
  if (status === 402 || status === 403) {
    return "The AI provider is unavailable right now. Please try again later.";
  }
  if (status === 404) {
    return "The configured AI model is unavailable. Please try again later.";
  }
  if (status === 429) {
    return "The advisor is busy right now. Please try again in a moment.";
  }
  if (status >= 500) {
    return "The advisor is temporarily unavailable.";
  }
  return "The advisor couldn't respond. Please try again.";
}

function parseSseData(event: string): string | null {
  const dataLines: string[] = [];

  for (const line of event.split(/\r?\n/)) {
    if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trimStart());
    }
  }

  if (dataLines.length === 0) return null;
  return dataLines.join("\n").trim();
}

async function* readOpenRouterStream(
  body: ReadableStream<Uint8Array>
): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const rawEvent of events) {
        const data = parseSseData(rawEvent);
        if (!data || data === "[DONE]") continue;

        let payload: unknown;
        try {
          payload = JSON.parse(data);
        } catch {
          continue;
        }

        if (!payload || typeof payload !== "object") continue;
        const chunk = payload as Record<string, unknown>;

        if (chunk.error) {
          throw new OpenRouterError("The advisor is temporarily unavailable.", 502);
        }

        const choices = chunk.choices;
        if (!Array.isArray(choices) || choices.length === 0) continue;

        const firstChoice = choices[0];
        if (!firstChoice || typeof firstChoice !== "object") continue;

        const delta = (firstChoice as Record<string, unknown>).delta;
        if (!delta || typeof delta !== "object") continue;

        const content = (delta as Record<string, unknown>).content;
        if (typeof content === "string" && content.length > 0) {
          yield content;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Sets up the upstream request before any bytes are streamed to the client, so
 * configuration and HTTP errors can still be returned as normal JSON errors.
 */
export async function createOpenRouterStream(
  config: AiConfig,
  messages: OpenRouterMessage[],
  signal?: AbortSignal
): Promise<AsyncGenerator<string>> {
  const body: Record<string, unknown> = {
    model: config.model,
    messages,
    stream: true,
    temperature: 0.3,
    max_tokens: 700,
  };

  if (config.fallbackModels.length > 0) {
    body.models = [config.model, ...config.fallbackModels];
  }

  let response: Response;
  try {
    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": config.siteUrl,
        "X-Title": config.appName,
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    throw new OpenRouterError("The advisor is temporarily unavailable.", 502);
  }

  if (!response.ok) {
    throw new OpenRouterError(safeErrorMessage(response.status), response.status);
  }

  if (!response.body) {
    throw new OpenRouterError("The advisor is temporarily unavailable.", 502);
  }

  return readOpenRouterStream(response.body);
}
