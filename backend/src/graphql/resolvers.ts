import { prisma } from "../config/prisma.js";
import { requireAuth } from "../common/auth/require-auth.js";
import { authService } from "../modules/auth/auth.service.js";
import { budgetReportService } from "../modules/budget-report/budget-report.service.js";
import { expenseService } from "../modules/expenses/expense.service.js";
import { incomeService } from "../modules/incomes/income.service.js";
import { invitationService } from "../modules/invitations/invitation.service.js";
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

    myInvitations: (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      const currentUser = requireAuth(context);

      return invitationService.listMyInvitations(currentUser.email);
    },

    expenses: (_parent: unknown, args: { projectId: string }, context: GraphQLContext) => {
      const currentUser = requireAuth(context);

      return expenseService.getExpenses(args.projectId, currentUser.id);
    },

    incomes: (_parent: unknown, args: { projectId: string }, context: GraphQLContext) => {
      const currentUser = requireAuth(context);

      return incomeService.getIncomes(args.projectId, currentUser.id);
    },

    budgetReport: (_parent: unknown, args: { projectId: string }, context: GraphQLContext) => {
      const currentUser = requireAuth(context);

      return budgetReportService.getBudgetReport(args.projectId, currentUser.id);
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

    inviteUser: (
      _parent: unknown,
      args: { input: { projectId: string; email: string } },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return invitationService.inviteUser(args.input, currentUser.id);
    },

    acceptInvitation: (_parent: unknown, args: { id: string }, context: GraphQLContext) => {
      const currentUser = requireAuth(context);

      return invitationService.acceptInvitation(args.id, currentUser.id, currentUser.email);
    },

    rejectInvitation: (_parent: unknown, args: { id: string }, context: GraphQLContext) => {
      const currentUser = requireAuth(context);

      return invitationService.rejectInvitation(args.id, currentUser.email);
    },

    createExpense: (
      _parent: unknown,
      args: { input: { projectId: string; name: string; amount: number } },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return expenseService.createExpense(args.input, currentUser.id);
    },

    updateExpense: (
      _parent: unknown,
      args: { id: string; input: { name?: string; amount?: number } },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return expenseService.updateExpense(args.id, args.input, currentUser.id);
    },

    deleteExpense: (_parent: unknown, args: { id: string }, context: GraphQLContext) => {
      const currentUser = requireAuth(context);

      return expenseService.deleteExpense(args.id, currentUser.id);
    },

    createIncome: (
      _parent: unknown,
      args: { input: { projectId: string; name: string; amount: number } },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return incomeService.createIncome(args.input, currentUser.id);
    },

    updateIncome: (
      _parent: unknown,
      args: { id: string; input: { name?: string; amount?: number } },
      context: GraphQLContext,
    ) => {
      const currentUser = requireAuth(context);

      return incomeService.updateIncome(args.id, args.input, currentUser.id);
    },

    deleteIncome: (_parent: unknown, args: { id: string }, context: GraphQLContext) => {
      const currentUser = requireAuth(context);

      return incomeService.deleteIncome(args.id, currentUser.id);
    },
  },
};
