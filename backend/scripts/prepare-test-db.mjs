import { config } from "dotenv";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const envTestPath = resolve(process.cwd(), ".env.test");

if (!existsSync(envTestPath)) {
  console.error("Missing .env.test. Copy .env.test.example to .env.test first.");
  process.exit(1);
}

config({ path: envTestPath });

const databaseUrl = process.env.DATABASE_URL ?? "";

if (!/test/i.test(databaseUrl)) {
  console.error(
    'Refusing to prepare test database: DATABASE_URL must contain "test" (e.g. project_finance_test_db).',
  );
  process.exit(1);
}

console.log("Applying Prisma schema to test database...");

execSync("npx prisma db push --skip-generate", {
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "test",
  },
});

console.log("Test database schema is ready.");
