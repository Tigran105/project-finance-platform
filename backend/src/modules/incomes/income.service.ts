import { prisma } from "../../config/prisma.js";
import { AppError } from "../../common/errors/app-error.js";
import { normalizeName } from "../../common/utils/normalize-name.js";
import { assertProjectAccess } from "../projects/project.access.js";
import { createIncomeSchema, updateIncomeSchema } from "./income.validation.js";

type CreateIncomeInput = {
  projectId: string;
  name: string;
  amount: number;
};

type UpdateIncomeInput = {
  name?: string;
  amount?: number;
};

export const incomeService = {
  async createIncome(input: CreateIncomeInput, userId: string) {
    const { error, value } = createIncomeSchema.validate(input);

    if (error) {
      throw new AppError(error.message, "VALIDATION_ERROR");
    }

    await assertProjectAccess(value.projectId, userId);

    return prisma.income.create({
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

  async updateIncome(incomeId: string, input: UpdateIncomeInput, userId: string) {
    const { error, value } = updateIncomeSchema.validate(input);

    if (error) {
      throw new AppError(error.message, "VALIDATION_ERROR");
    }

    const income = await prisma.income.findUnique({
      where: {
        id: incomeId,
      },
      include: {
        project: true,
      },
    });

    if (!income) {
      throw new AppError("Income not found", "NOT_FOUND");
    }

    await assertProjectAccess(income.projectId, userId);

    const isProjectOwner = income.project.creatorId === userId;
    const isIncomeCreator = income.creatorId === userId;

    if (!isProjectOwner && !isIncomeCreator) {
      throw new AppError("Only income creator or project owner can update this income", "FORBIDDEN");
    }

    return prisma.income.update({
      where: {
        id: incomeId,
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

  async deleteIncome(incomeId: string, userId: string) {
    const income = await prisma.income.findUnique({
      where: {
        id: incomeId,
      },
      include: {
        project: true,
      },
    });

    if (!income) {
      throw new AppError("Income not found", "NOT_FOUND");
    }

    await assertProjectAccess(income.projectId, userId);

    const isProjectOwner = income.project.creatorId === userId;
    const isIncomeCreator = income.creatorId === userId;

    if (!isProjectOwner && !isIncomeCreator) {
      throw new AppError("Only income creator or project owner can delete this income", "FORBIDDEN");
    }

    await prisma.income.delete({
      where: {
        id: incomeId,
      },
    });

    return true;
  },

  async getIncomes(projectId: string, userId: string) {
    await assertProjectAccess(projectId, userId);

    return prisma.income.findMany({
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
