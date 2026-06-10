import { prisma } from "../config/prisma.js";
import { authService } from "../modules/auth/auth.service.js";
import type { GraphQLContext } from "./context.js";

export const resolvers = {
  Query: {
    health: () => "OK",

    dbHealth: async () => {
      await prisma.$queryRaw`SELECT 1`;
      return "Database OK";
    },

    me: (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      return context.currentUser;
    },
  },

  Mutation: {
    register: (_parent: unknown, args: { input: { name: string; email: string; password: string } }) => {
      return authService.register(args.input);
    },

    login: (_parent: unknown, args: { input: { email: string; password: string } }) => {
      return authService.login(args.input);
    },
  },
};
