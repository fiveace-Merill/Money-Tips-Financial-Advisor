import { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import type { AuthUser } from "@/types/auth";
import { getInitials } from "./initials";
import { hashPassword, verifyPassword } from "./password";
import {
  generateSessionToken,
  getSessionExpiry,
  hashSessionToken,
} from "./session";
import type { LoginSchemaInput, RegisterSchemaInput } from "./validation";

export class EmailInUseError extends Error {
  constructor() {
    super("An account with that email already exists.");
    this.name = "EmailInUseError";
  }
}

export function toAuthUser(user: {
  id: string;
  name: string;
  email: string;
}): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    initials: getInitials(user.name),
  };
}

async function createSessionForUser(user: {
  id: string;
  name: string;
  email: string;
}) {
  const token = generateSessionToken();
  await prisma.session.create({
    data: {
      tokenHash: hashSessionToken(token),
      userId: user.id,
      expiresAt: getSessionExpiry(),
    },
  });

  return { user: toAuthUser(user), token };
}

export async function registerUser(input: RegisterSchemaInput) {
  const passwordHash = await hashPassword(input.password);

  let user;
  try {
    user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new EmailInUseError();
    }
    throw error;
  }

  return createSessionForUser(user);
}

export async function authenticateUser(input: LoginSchemaInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) return null;

  const isValid = await verifyPassword(input.password, user.passwordHash);
  if (!isValid) return null;

  return createSessionForUser(user);
}

export async function getUserFromToken(token: string): Promise<AuthUser | null> {
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    include: { user: true },
  });

  if (!session) return null;

  if (session.expiresAt <= new Date()) {
    await prisma.session
      .delete({ where: { id: session.id } })
      .catch(() => undefined);
    return null;
  }

  return toAuthUser(session.user);
}

export async function destroySession(token: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { tokenHash: hashSessionToken(token) },
  });
}
