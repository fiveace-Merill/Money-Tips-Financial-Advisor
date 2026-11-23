import { Prisma } from "@/server/generated/prisma";
import { getPrisma } from "@/server/prisma/client";
import type { ChatSession } from "@/types/message";
import type { ChatStateInput } from "./stateValidation";

export type ChatState = {
  sessions: ChatSession[];
  activeId: string;
};

function mapSessions(
  sessions: Array<{
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    messages: Array<{
      id: string;
      role: "USER" | "AI";
      content: string;
      createdAt: Date;
    }>;
  }>
): ChatSession[] {
  return sessions.map((session) => ({
    id: session.id,
    title: session.title,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
    messages: session.messages.map((message) => ({
      id: message.id,
      role: message.role === "AI" ? "ai" : "user",
      content: message.content,
      createdAt: message.createdAt.toISOString(),
    })),
  }));
}

export async function getChatState(userId: string): Promise<ChatState> {
  const [user, sessions] = await Promise.all([
    getPrisma().user.findUnique({
      where: { id: userId },
      select: { activeChatId: true },
    }),
    getPrisma().chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    }),
  ]);

  return {
    sessions: mapSessions(sessions),
    activeId: user?.activeChatId ?? "",
  };
}

export async function saveChatState(
  userId: string,
  input: ChatStateInput
): Promise<ChatState> {
  const activeId = input.sessions.some((session) => session.id === input.activeId)
    ? input.activeId
    : (input.sessions[0]?.id ?? "");

  await getPrisma().$transaction(async (tx) => {
    await tx.chatSession.deleteMany({ where: { userId } });

    await tx.user.update({
      where: { id: userId },
      data: { activeChatId: activeId || null },
    });

    for (const session of input.sessions) {
      await tx.chatSession.create({
        data: {
          id: session.id,
          userId,
          title: session.title,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: {
            create: session.messages.map((message) => ({
              id: message.id,
              role: message.role === "ai" ? "AI" : "USER",
              content: message.content,
              createdAt: new Date(message.createdAt),
            })),
          },
        },
      });
    }
  });

  return getChatState(userId);
}

export async function importGuestChatState(
  userId: string,
  input: ChatStateInput
): Promise<ChatState> {
  const prisma = getPrisma();
  const existingImport = await prisma.guestImport.findUnique({
    where: { userId },
  });

  if (!existingImport) {
    const existingSessionCount = await prisma.chatSession.count({
      where: { userId },
    });

    if (existingSessionCount === 0 && input.sessions.length > 0) {
      await saveChatState(userId, input);
    }

    try {
      await prisma.guestImport.create({ data: { userId } });
    } catch (error) {
      if (
        !(
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        )
      ) {
        throw error;
      }
    }
  }

  return getChatState(userId);
}
