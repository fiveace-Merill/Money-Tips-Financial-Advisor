import { getAiConfig } from "@/server/ai/config";
import { createOpenRouterStream } from "@/server/ai/openrouter";
import { toOpenRouterMessages, type ChatRequestInput } from "./validation";

export const SYSTEM_PROMPT = [
  "You are Money Tips, a friendly financial education assistant.",
  "Give practical, general guidance and explain your reasoning in plain language.",
  "You are not a licensed financial adviser and must not present advice as personalised professional advice.",
  "Never invent balances, account numbers, transactions, returns, or other facts.",
  "If a calculation needs exact numbers, ask the user to provide them instead of guessing.",
  "Keep answers concise and focused on the user's question.",
].join(" ");

export function createAdvisorStream(
  input: ChatRequestInput,
  signal?: AbortSignal
) {
  const config = getAiConfig();
  return createOpenRouterStream(
    config,
    toOpenRouterMessages(input, SYSTEM_PROMPT),
    signal
  );
}
