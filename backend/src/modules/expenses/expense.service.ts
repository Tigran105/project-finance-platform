import { prisma } from "../../config/prisma.js";
import { AppError } from "../../common/errors/app-error.js";
import { normalizeName } from "../../common/utils/normalize-name.js";
import { assertProjectAccess, assertProjectOwner } from "../projects/project.access.js";
import { createExpenseSchema, updateExpenseSchema } from "./expense.validation.js";

type CreateExpenseInput = {
  projectId: string;
  name: string;
  amount: number;
};

type UpdateExpenseInput = {
  name?: string;
  amount?: number;
};

export const expenseService = {
  async createExpense(input: CreateExpenseInput, userId: string) {
    const { error, value } = createExpenseSchema.validate(input);

    if (error) {
      throw new AppError(error.message, "VALIDATION_ERROR");
    }

    await assertProjectAccess(value.projectId, userId);

    return prisma.expense.create({
      data: {
        projectId: value.projectId,
        creatorId: userId,
        name: value.name.trim(),
        normalizedName: normalizeName(value.name),
        amount: value.amount,
      },
      include: {
        creator: true,
        project: true,
      },
    });
  },

  async updateExpense(expenseId: string, input: UpdateExpenseInput, userId: string) {
    const { error, value } = updateExpenseSchema.validate(input);

    if (error) {
      throw new AppError(error.message, "VALIDATION_ERROR");
    }

    const expense = await prisma.expense.findUnique({
      where: {
        id: expenseId,
      },
      include: {
        project: true,
      },
    });

    if (!expense) {
      throw new AppError("Expense not found", "NOT_FOUND");
    }

    await assertProjectAccess(expense.projectId, userId);

    const isProjectOwner = expense.project.creatorId === userId;
    const isExpenseCreator = expense.creatorId === userId;

    if (!isProjectOwner && !isExpenseCreator) {
      throw new AppError("Only expense creator or project owner can update this expense", "FORBIDDEN");
    }

    return prisma.expense.update({
      where: {
        id: expenseId,
      },
      data: {
        ...(value.name !== undefined && {
          name: value.name.trim(),
          normalizedName: normalizeName(value.name),
        }),
        ...(value.amount !== undefined && {
          amount: value.amount,
        }),
      },
      include: {
        creator: true,
        project: true,
      },
    });
  },

  async deleteExpense(expenseId: string, userId: string) {
    const expense = await prisma.expense.findUnique({
      where: {
        id: expenseId,
      },
      include: {
        project: true,
      },
    });

    if (!expense) {
      throw new AppError("Expense not found", "NOT_FOUND");
    }

    await assertProjectAccess(expense.projectId, userId);

    const isProjectOwner = expense.project.creatorId === userId;
    const isExpenseCreator = expense.creatorId === userId;

    if (!isProjectOwner && !isExpenseCreator) {
      throw new AppError("Only expense creator or project owner can delete this expense", "FORBIDDEN");
    }

    await prisma.expense.delete({
      where: {
        id: expenseId,
      },
    });

    return true;
  },

  async getExpenses(projectId: string, userId: string) {
    await assertProjectAccess(projectId, userId);

    return prisma.expense.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        creator: true,
        project: true,
      },
    });
  },
};
