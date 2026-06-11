import { existsSync } from "node:fs";
import { resolve } from "node:path";

import dotenv from "dotenv";

const isTestEnvironment = process.env.NODE_ENV === "test";
const envFileName = isTestEnvironment ? ".env.test" : ".env";
const envFilePath = resolve(process.cwd(), envFileName);

if (isTestEnvironment && !existsSync(envFilePath)) {
  throw new Error(
    `Missing ${envFileName}. Copy .env.test.example to .env.test and point DATABASE_URL at a dedicated test database.`,
  );
}

dotenv.config({ path: envFilePath });

if (isTestEnvironment) {
  const databaseUrl = process.env.DATABASE_URL ?? "";

  if (!/test/i.test(databaseUrl)) {
    throw new Error(
      "Refusing to run tests: DATABASE_URL in .env.test must reference a dedicated test database (URL should contain \"test\").",
    );
  }
}
