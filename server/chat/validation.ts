import { z } from "zod";
import type { OpenRouterMessage } from "@/server/ai/openrouter";

const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 4_000;
const MAX_CONVERSATION_CHARS = 12_000;

const chatMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(["user", "ai"]),
  content: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
  createdAt: z.string().optional(),
});

export const chatRequestSchema = z
  .object({
    messages: z.array(chatMessageSchema).min(1).max(MAX_MESSAGES),
  })
  .refine(
    ({ messages }) =>
      messages.reduce((total, message) => total + message.content.length, 0) <=
      MAX_CONVERSATION_CHARS,
    { message: "Conversation is too long.", path: ["messages"] }
  );

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;

export function toOpenRouterMessages(
  input: ChatRequestInput,
  systemPrompt: string
): OpenRouterMessage[] {
  return [
    { role: "system", content: systemPrompt },
    ...input.messages.map((message) => ({
      role: message.role === "ai" ? ("assistant" as const) : ("user" as const),
      content: message.content,
    })),
  ];
}
