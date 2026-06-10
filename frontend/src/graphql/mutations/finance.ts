import { gql } from "@apollo/client";

import { EXPENSE_FIELDS, INCOME_FIELDS } from "@/graphql/fragments/finance";

export const CREATE_EXPENSE_MUTATION = gql`
  ${EXPENSE_FIELDS}
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      ...ExpenseFields
    }
  }
`;

export const UPDATE_EXPENSE_MUTATION = gql`
  ${EXPENSE_FIELDS}
  mutation UpdateExpense($id: ID!, $input: UpdateExpenseInput!) {
    updateExpense(id: $id, input: $input) {
      ...ExpenseFields
    }
  }
`;

export const DELETE_EXPENSE_MUTATION = gql`
  mutation DeleteExpense($id: ID!) {
    deleteExpense(id: $id)
  }
`;

export const CREATE_INCOME_MUTATION = gql`
  ${INCOME_FIELDS}
  mutation CreateIncome($input: CreateIncomeInput!) {
    createIncome(input: $input) {
      ...IncomeFields
    }
  }
`;

export const UPDATE_INCOME_MUTATION = gql`
  ${INCOME_FIELDS}
  mutation UpdateIncome($id: ID!, $input: UpdateIncomeInput!) {
    updateIncome(id: $id, input: $input) {
      ...IncomeFields
    }
  }
`;

export const DELETE_INCOME_MUTATION = gql`
  mutation DeleteIncome($id: ID!) {
    deleteIncome(id: $id)
  }
`;
