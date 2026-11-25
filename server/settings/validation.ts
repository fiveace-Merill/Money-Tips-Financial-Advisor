import { z } from "zod";

export const themeSchema = z.enum(["light", "dark", "system"]);

export const preferencesSchema = z.object({
  theme: themeSchema,
});

export type PreferencesInput = z.infer<typeof preferencesSchema>;
