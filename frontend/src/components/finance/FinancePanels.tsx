import {
  CREATE_EXPENSE_MUTATION,
  CREATE_INCOME_MUTATION,
  DELETE_EXPENSE_MUTATION,
  DELETE_INCOME_MUTATION,
  UPDATE_EXPENSE_MUTATION,
  UPDATE_INCOME_MUTATION,
} from "@/graphql/mutations/finance";
import { EXPENSES_QUERY, INCOMES_QUERY } from "@/graphql/queries/finance";

import { FinanceRecordsPanel } from "./FinanceRecordsPanel";

type ExpensesPanelProps = {
  projectId: string;
  projectOwnerId: string;
  currentUserId: string;
};

export function ExpensesPanel(props: ExpensesPanelProps) {
  return (
    <FinanceRecordsPanel
      {...props}
      kind="expense"
      listQuery={EXPENSES_QUERY}
      createMutation={CREATE_EXPENSE_MUTATION}
      updateMutation={UPDATE_EXPENSE_MUTATION}
      deleteMutation={DELETE_EXPENSE_MUTATION}
      listField="expenses"
    />
  );
}

type IncomesPanelProps = {
  projectId: string;
  projectOwnerId: string;
  currentUserId: string;
};

export function IncomesPanel(props: IncomesPanelProps) {
  return (
    <FinanceRecordsPanel
      {...props}
      kind="income"
      listQuery={INCOMES_QUERY}
      createMutation={CREATE_INCOME_MUTATION}
      updateMutation={UPDATE_INCOME_MUTATION}
      deleteMutation={DELETE_INCOME_MUTATION}
      listField="incomes"
    />
  );
}
