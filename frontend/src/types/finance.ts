import type { User } from "@/types/auth";

export type FinanceRecord = {
  id: string;
  projectId: string;
  creatorId: string;
  name: string;
  normalizedName: string;
  amount: number;
  creator: User;
  createdAt: string;
  updatedAt: string;
};

export type Expense = FinanceRecord;
export type Income = FinanceRecord;

export type CreateFinanceInput = {
  projectId: string;
  name: string;
  amount: number;
};

export type UpdateFinanceInput = {
  name?: string;
  amount?: number;
};

export type BudgetReportItem = {
  name: string;
  totalIncome: number;
  totalExpense: number;
  difference: number;
};

export type BudgetReport = {
  projectId: string;
  totalIncome: number;
  totalExpense: number;
  difference: number;
  items: BudgetReportItem[];
};
