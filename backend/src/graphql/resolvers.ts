import { prisma } from "../config/prisma.js";
import { requireAuth } from "../common/auth/require-auth.js";
import { authService } from "../modules/auth/auth.service.js";
import { projectService } from "../modules/projects/project.service.js";
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

    projects: (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      const currentUser = requireAuth(context);

      return projectService.listAvailableProjects(currentUser.id);
    },

    project: (_parent: unknown, args: { id: string }, context: GraphQLContext) => {
      const currentUser = requireAuth(context);

      return projectService.getProject(args.id, currentUser.id);
    },
  },

  Mutation: {
    register: (
      _parent: unknown,
      args: { input: { name: string; email: string; password: string } },
    ) => {
      return authService.register(args.input);
    },

    login: (_parent: unknown, args: { input: { email: string; password: string } }) => {
      return authService.login(args.input);
    },

    createProject: (
      _parent: unknown,
      args: { input: { name: string; location: string } },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return projectService.createProject(args.input, currentUser.id);
    },

    updateProject: (
      _parent: unknown,
      args: { id: string; input: { name?: string; location?: string } },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return projectService.updateProject(args.id, args.input, currentUser.id);
    },

    deleteProject: (_parent: unknown, args: { id: string }, context: GraphQLContext) => {
      const currentUser = requireAuth(context);

      return projectService.deleteProject(args.id, currentUser.id);
    },
  },
};
