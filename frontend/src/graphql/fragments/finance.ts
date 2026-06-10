import { gql } from "@apollo/client";

import { USER_FIELDS } from "@/graphql/fragments/user";

export const EXPENSE_FIELDS = gql`
  ${USER_FIELDS}
  fragment ExpenseFields on Expense {
    id
    projectId
    creatorId
    name
    normalizedName
    amount
    createdAt
    updatedAt
    creator {
      ...UserFields
    }
  }
`;

export const INCOME_FIELDS = gql`
  ${USER_FIELDS}
  fragment IncomeFields on Income {
    id
    projectId
    creatorId
    name
    normalizedName
    amount
    createdAt
    updatedAt
    creator {
      ...UserFields
    }
  }
`;

export const BUDGET_REPORT_FIELDS = gql`
  fragment BudgetReportFields on BudgetReport {
    projectId
    totalIncome
    totalExpense
    difference
    items {
      name
      totalIncome
      totalExpense
      difference
    }
  }
`;
