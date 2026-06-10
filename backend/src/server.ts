import http from "http";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { createGraphQLContext } from "./graphql/context.js";
import { resolvers } from "./graphql/resolvers.js";
import { typeDefs } from "./graphql/typeDefs.js";

async function bootstrap() {
  const app = express();
  const httpServer = http.createServer(app);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(apolloServer, {
      context: createGraphQLContext,
    }),
  );

  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      service: "project-finance-backend",
    });
  });

  httpServer.listen(env.port, () => {
    console.log(`Backend is running on http://localhost:${env.port}`);
    console.log(`GraphQL endpoint: http://localhost:${env.port}/graphql`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start backend server:", error);
  process.exit(1);
});
