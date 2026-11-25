import { Prisma, ThemePreference as DbThemePreference } from "@/server/generated/prisma";
import { getPrisma } from "@/server/prisma/client";
import type { PreferencesInput } from "./validation";

export type PreferencesState = {
  theme: PreferencesInput["theme"];
};

function toDbTheme(theme: PreferencesInput["theme"]): DbThemePreference {
  return theme.toUpperCase() as DbThemePreference;
}

function toClientTheme(theme: DbThemePreference): PreferencesInput["theme"] {
  return theme.toLowerCase() as PreferencesInput["theme"];
}

export async function getPreferences(userId: string): Promise<PreferencesState> {
  const preference = await getPrisma().userPreference.findUnique({
    where: { userId },
    select: { theme: true },
  });

  return { theme: preference ? toClientTheme(preference.theme) : "system" };
}

export async function savePreferences(
  userId: string,
  input: PreferencesInput
): Promise<PreferencesState> {
  const theme = toDbTheme(input.theme);

  await getPrisma().userPreference.upsert({
    where: { userId },
    create: { userId, theme },
    update: { theme },
  });

  return { theme: input.theme };
}

export async function importGuestPreferences(
  userId: string,
  input: PreferencesInput
): Promise<PreferencesState> {
  const prisma = getPrisma();
  const existing = await prisma.userPreference.findUnique({
    where: { userId },
    select: { userId: true },
  });

  if (!existing) {
    try {
      await prisma.userPreference.create({
        data: { userId, theme: toDbTheme(input.theme) },
      });
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

  return getPreferences(userId);
}
