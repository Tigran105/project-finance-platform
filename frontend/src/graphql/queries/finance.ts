import { gql } from "@apollo/client";

import {
  BUDGET_REPORT_FIELDS,
  EXPENSE_FIELDS,
  INCOME_FIELDS,
} from "@/graphql/fragments/finance";

export const EXPENSES_QUERY = gql`
  ${EXPENSE_FIELDS}
  query Expenses($projectId: ID!) {
    expenses(projectId: $projectId) {
      ...ExpenseFields
    }
  }
`;

export const INCOMES_QUERY = gql`
  ${INCOME_FIELDS}
  query Incomes($projectId: ID!) {
    incomes(projectId: $projectId) {
      ...IncomeFields
    }
  }
`;

export const BUDGET_REPORT_QUERY = gql`
  ${BUDGET_REPORT_FIELDS}
  query BudgetReport($projectId: ID!) {
    budgetReport(projectId: $projectId) {
      ...BudgetReportFields
    }
  }
`;
