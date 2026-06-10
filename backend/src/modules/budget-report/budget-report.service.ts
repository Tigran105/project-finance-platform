import { Prisma } from "@prisma/client";

import { prisma } from "../../config/prisma.js";
import { assertProjectAccess } from "../projects/project.access.js";

type BudgetReportItem = {
  name: string;
  totalIncome: number;
  totalExpense: number;
  difference: number;
};

type BudgetReport = {
  projectId: string;
  totalIncome: number;
  totalExpense: number;
  difference: number;
  items: BudgetReportItem[];
};

function decimalToNumber(value: Prisma.Decimal | null | undefined) {
  return value ? Number(value) : 0;
}

export const budgetReportService = {
  async getBudgetReport(projectId: string, userId: string): Promise<BudgetReport> {
    await assertProjectAccess(projectId, userId);

    const [expenseGroups, incomeGroups] = await Promise.all([
      prisma.expense.groupBy({
        by: ["normalizedName"],
        where: {
          projectId,
        },
        _sum: {
          amount: true,
        },
      }),

      prisma.income.groupBy({
        by: ["normalizedName"],
        where: {
          projectId,
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    const reportMap = new Map<string, BudgetReportItem>();

    for (const expenseGroup of expenseGroups) {
      const name = expenseGroup.normalizedName;
      const totalExpense = decimalToNumber(expenseGroup._sum.amount);

      reportMap.set(name, {
        name,
        totalIncome: 0,
        totalExpense,
        difference: 0 - totalExpense,
      });
    }

    for (const incomeGroup of incomeGroups) {
      const name = incomeGroup.normalizedName;
      const totalIncome = decimalToNumber(incomeGroup._sum.amount);

      const existingItem = reportMap.get(name);

      if (existingItem) {
        existingItem.totalIncome = totalIncome;
        existingItem.difference = totalIncome - existingItem.totalExpense;
      } else {
        reportMap.set(name, {
          name,
          totalIncome,
          totalExpense: 0,
          difference: totalIncome,
        });
      }
    }

    const items = Array.from(reportMap.values()).sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    const totalIncome = items.reduce((sum, item) => sum + item.totalIncome, 0);
    const totalExpense = items.reduce((sum, item) => sum + item.totalExpense, 0);

    return {
      projectId,
      totalIncome,
      totalExpense,
      difference: totalIncome - totalExpense,
      items,
    };
  },
};
