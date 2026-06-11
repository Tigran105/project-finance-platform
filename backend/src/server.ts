import http from "http";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import {
  ApolloServerPluginLandingPageLocalDefault,
} from "@apollo/server/plugin/landingPage/default";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env.js";
import { createGraphQLContext } from "./graphql/context.js";
import { formatGraphQLError } from "./graphql/format-error.js";
import { resolvers } from "./graphql/resolvers.js";
import { typeDefs } from "./graphql/typeDefs.js";

async function bootstrap() {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(
    helmet(
      env.isProduction
        ? {}
        : {
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false,
          },
    ),
  );

  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: true,
    }),
  );

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: !env.isProduction,
    includeStacktraceInErrorResponses: !env.isProduction,
    formatError: formatGraphQLError,
    plugins: [
      ...(env.isProduction ? [] : [ApolloServerPluginLandingPageLocalDefault()]),
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
  });

  await apolloServer.start();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      service: "project-finance-backend",
    });
  });

  app.use(
    "/graphql",
    expressMiddleware(apolloServer, {
      context: createGraphQLContext,
    }),
  );

  httpServer.listen(env.port, () => {
    console.log(`Backend is running on http://localhost:${env.port}`);
    console.log(`GraphQL endpoint: http://localhost:${env.port}/graphql`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start backend server:", error);
  process.exit(1);
});
