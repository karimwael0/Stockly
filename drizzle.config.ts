import { defineConfig } from "drizzle-kit";


export default defineConfig({
  schema: "./db/schema.ts", // Ensure this path matches where you put schema.ts
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: {
    // IMPORTANT: Use DIRECT_URL (Port 5432) for migrations
    url: process.env.DATABASE_URL!,
  },
});