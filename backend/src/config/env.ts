import "./load-env.js";

const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const nodeEnv = process.env.NODE_ENV ?? "development";
const isProduction = nodeEnv === "production";
const jwtSecret = process.env.JWT_SECRET as string;

const weakJwtSecrets = new Set([
  "your_jwt_secret",
  "change_this_secret_later",
  "test_jwt_secret",
]);

if (isProduction && weakJwtSecrets.has(jwtSecret.trim().toLowerCase())) {
  throw new Error(
    "JWT_SECRET must be set to a strong, non-placeholder value in production.",
  );
}

export const env = {
  nodeEnv,
  isProduction,
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL as string,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};
