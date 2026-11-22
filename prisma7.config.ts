import "dotenv/config";
import { defineConfig } from "prisma/config";

// `prisma generate` does not connect to the database, so it must not require a
// real URL at install/build time. Migrations still use the direct Neon URL when
// it is available; the placeholder is only reached when no environment is set.
const databaseUrl =
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.DATABASE_URL ??
  "postgresql://user:password@localhost:5432/money_tips";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
});
