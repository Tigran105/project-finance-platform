import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BudgetReportPanel } from "./BudgetReportPanel";
import { BUDGET_REPORT_QUERY } from "../../graphql/queries/finance";
import { mockBudgetReport, createMockBudgetReport } from "../../test/fixtures/finance";
import { renderWithProviders } from "../../test/renderWithProviders";
import { formatCurrency } from "../../utils/currency";

describe("BudgetReportPanel", () => {
  it("renders aggregated budget report rows and totals", async () => {
    renderWithProviders(<BudgetReportPanel projectId="project-1" />, {
      mocks: [
        {
          request: {
            query: BUDGET_REPORT_QUERY,
            variables: { projectId: "project-1" },
          },
          result: {
            data: {
              budgetReport: mockBudgetReport,
            },
          },
        },
      ],
    });

    expect(await screen.findByText("Budget report")).toBeInTheDocument();
    expect(await screen.findByText("materials")).toBeInTheDocument();
    expect(screen.getByText("labor")).toBeInTheDocument();
    expect(screen.getAllByText(formatCurrency(mockBudgetReport.totalIncome)).length).toBeGreaterThan(0);
    expect(screen.getAllByText(formatCurrency(mockBudgetReport.totalExpense)).length).toBeGreaterThan(0);
    expect(screen.getAllByText(formatCurrency(mockBudgetReport.difference)).length).toBeGreaterThan(0);
  });

  it("shows an empty state when there are no report items", async () => {
    renderWithProviders(<BudgetReportPanel projectId="project-1" />, {
      mocks: [
        {
          request: {
            query: BUDGET_REPORT_QUERY,
            variables: { projectId: "project-1" },
          },
          result: {
            data: {
              budgetReport: createMockBudgetReport({
                totalIncome: 0,
                totalExpense: 0,
                difference: 0,
                items: [],
              }),
            },
          },
        },
      ],
    });

    await waitFor(() => {
      expect(screen.getByText("No income or expense records to report yet.")).toBeInTheDocument();
    });
  });
});
