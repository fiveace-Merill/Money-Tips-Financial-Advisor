export class AiConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiConfigError";
  }
}

export type AiConfig = {
  apiKey: string;
  model: string;
  fallbackModels: string[];
  siteUrl: string;
  appName: string;
};

const DEFAULT_MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free";
const DEFAULT_FALLBACK_MODELS = ["nvidia/nemotron-3.5-lightning:free"];

function isFreeModel(model: string): boolean {
  return model === "openrouter/free" || model.endsWith(":free");
}

/**
 * Resolved at request time so builds and installs never depend on AI secrets.
 * Every configured model is checked here to guarantee no paid fallback.
 */
export function getAiConfig(): AiConfig {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    throw new AiConfigError(
      "AI is not configured. Add OPENROUTER_API_KEY to the server environment."
    );
  }

  const model = process.env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL;
  if (!isFreeModel(model)) {
    throw new AiConfigError(
      `Configured AI model "${model}" is not a free OpenRouter model.`
    );
  }

  const configuredFallbacks = (process.env.OPENROUTER_FALLBACK_MODELS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const fallbackModels = configuredFallbacks.length
    ? configuredFallbacks
    : DEFAULT_FALLBACK_MODELS;

  for (const fallback of fallbackModels) {
    if (!isFreeModel(fallback)) {
      throw new AiConfigError(
        `Fallback AI model "${fallback}" is not a free OpenRouter model.`
      );
    }
  }

  return {
    apiKey,
    model,
    fallbackModels: fallbackModels.filter((value) => value !== model),
    siteUrl: process.env.OPENROUTER_SITE_URL?.trim() || "http://localhost:3000",
    appName: process.env.OPENROUTER_APP_NAME?.trim() || "Money Tips",
  };
}
