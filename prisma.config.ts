import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const databaseUrl = env("DATABASE_URL");
// Prisma 6 resolved SQLite URLs from prisma/schema.prisma. Preserve the existing
// ShopAI database location while Prisma 7 resolves URLs from this config file.
const sqliteUrl =
  databaseUrl === "file:./dev.db" ? "file:./prisma/dev.db" : databaseUrl;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: sqliteUrl,
  },
});
