import type { BudgetReport, BudgetReportItem } from "../../types/finance";

function withBudgetReportItemTypename(item: BudgetReportItem): BudgetReportItem & { __typename: string } {
  return {
    __typename: "BudgetReportItem",
    ...item,
  };
}

export function createMockBudgetReport(overrides: Partial<BudgetReport> = {}) {
  const items = overrides.items ?? [
    {
      name: "materials",
      totalIncome: 2000,
      totalExpense: 1500,
      difference: 500,
    },
    {
      name: "labor",
      totalIncome: 3000,
      totalExpense: 1700,
      difference: 1300,
    },
  ];

  return {
    __typename: "BudgetReport",
    projectId: "project-1",
    totalIncome: 5000,
    totalExpense: 3200,
    difference: 1800,
    ...overrides,
    items: items.map(withBudgetReportItemTypename),
  };
}

export const mockBudgetReport = createMockBudgetReport();
