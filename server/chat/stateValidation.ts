import { z } from "zod";
import type { ChatSession } from "@/types/message";

const MAX_SESSIONS = 100;
const MAX_MESSAGES_PER_SESSION = 200;
const MAX_TOTAL_MESSAGES = 1_000;
const MAX_TITLE_CHARS = 120;
const MAX_CONTENT_CHARS = 8_000;
const MAX_ID_CHARS = 64;

const isoDate = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: "Invalid timestamp.",
});

const stateMessageSchema = z.object({
  id: z.string().min(1).max(MAX_ID_CHARS),
  role: z.enum(["user", "ai"]),
  content: z.string().max(MAX_CONTENT_CHARS),
  createdAt: isoDate,
});

const stateSessionSchema = z.object({
  id: z.string().min(1).max(MAX_ID_CHARS),
  title: z.string().trim().min(1).max(MAX_TITLE_CHARS),
  messages: z.array(stateMessageSchema).max(MAX_MESSAGES_PER_SESSION),
  createdAt: isoDate,
  updatedAt: isoDate,
});

export const chatStateSchema = z
  .object({
    sessions: z.array(stateSessionSchema).max(MAX_SESSIONS),
    activeId: z.string().max(MAX_ID_CHARS),
  })
  .refine(
    ({ sessions }) => {
      const ids = sessions.map((session) => session.id);
      return new Set(ids).size === ids.length;
    },
    { message: "Duplicate session id.", path: ["sessions"] }
  )
  .refine(
    ({ sessions }) =>
      sessions.reduce((total, session) => total + session.messages.length, 0) <=
      MAX_TOTAL_MESSAGES,
    { message: "Too many messages.", path: ["sessions"] }
  )
  .refine(
    ({ sessions }) =>
      sessions.every((session) => {
        const ids = session.messages.map((message) => message.id);
        return new Set(ids).size === ids.length;
      }),
    { message: "Duplicate message id.", path: ["sessions"] }
  );

export type ChatStateInput = z.infer<typeof chatStateSchema>;

export function toClientSessions(sessions: ChatStateInput["sessions"]): ChatSession[] {
  return sessions.map((session) => ({
    id: session.id,
    title: session.title,
    messages: session.messages.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      createdAt: new Date(message.createdAt).toISOString(),
    })),
    createdAt: new Date(session.createdAt).toISOString(),
    updatedAt: new Date(session.updatedAt).toISOString(),
  }));
}
