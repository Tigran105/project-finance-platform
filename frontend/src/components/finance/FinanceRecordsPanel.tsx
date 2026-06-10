import { useMutation, useQuery, type DocumentNode } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";

import { FinanceRecordDialog } from "@/components/finance/FinanceRecordDialog";
import { BUDGET_REPORT_QUERY } from "@/graphql/queries/finance";
import type {
  CreateFinanceInput,
  FinanceRecord,
  UpdateFinanceInput,
} from "@/types/finance";
import { formatCurrency } from "@/utils/currency";
import { getGraphQLErrorMessage } from "@/utils/graphql-error";
import type { FinanceRecordFormValues } from "@/validation/finance";

type FinanceRecordsPanelProps = {
  projectId: string;
  projectOwnerId: string;
  currentUserId: string;
  kind: "expense" | "income";
  listQuery: DocumentNode;
  createMutation: DocumentNode;
  updateMutation: DocumentNode;
  deleteMutation: DocumentNode;
  listField: "expenses" | "incomes";
};

type DialogState =
  | { mode: "create" }
  | { mode: "edit"; record: FinanceRecord };

export function FinanceRecordsPanel({
  projectId,
  projectOwnerId,
  currentUserId,
  kind,
  listQuery,
  createMutation,
  updateMutation,
  deleteMutation,
  listField,
}: FinanceRecordsPanelProps) {
  const [dialogState, setDialogState] = useState<DialogState | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const labels = useMemo(
    () =>
      kind === "expense"
        ? {
            title: "Expenses",
            singular: "expense",
            empty: "No expenses recorded yet.",
            add: "Add expense",
            createTitle: "Add expense",
            editTitle: "Edit expense",
          }
        : {
            title: "Incomes",
            singular: "income",
            empty: "No incomes recorded yet.",
            add: "Add income",
            createTitle: "Add income",
            editTitle: "Edit income",
          },
    [kind],
  );

  const refetchQueries = [
    { query: listQuery, variables: { projectId } },
    { query: BUDGET_REPORT_QUERY, variables: { projectId } },
  ];

  const { data, loading, error } = useQuery<Record<string, FinanceRecord[]>>(listQuery, {
    variables: { projectId },
  });

  const [createRecord, { loading: creating }] = useMutation(createMutation, {
    refetchQueries,
  });
  const [updateRecord, { loading: updating }] = useMutation(updateMutation, {
    refetchQueries,
  });
  const [deleteRecord] = useMutation(deleteMutation, { refetchQueries });

  const records = data?.[listField] ?? [];

  const canModify = (record: FinanceRecord) =>
    currentUserId === projectOwnerId || currentUserId === record.creatorId;

  const handleCreate = async (values: FinanceRecordFormValues) => {
    setServerError(null);

    try {
      await createRecord({
        variables: {
          input: {
            projectId,
            name: values.name.trim(),
            amount: values.amount,
          } satisfies CreateFinanceInput,
        },
      });
      setDialogState(null);
    } catch (mutationError) {
      setServerError(getGraphQLErrorMessage(mutationError, `Failed to add ${labels.singular}.`));
    }
  };

  const handleUpdate = async (values: FinanceRecordFormValues) => {
    if (!dialogState || dialogState.mode !== "edit") {
      return;
    }

    setServerError(null);

    try {
      await updateRecord({
        variables: {
          id: dialogState.record.id,
          input: {
            name: values.name.trim(),
            amount: values.amount,
          } satisfies UpdateFinanceInput,
        },
      });
      setDialogState(null);
    } catch (mutationError) {
      setServerError(getGraphQLErrorMessage(mutationError, `Failed to update ${labels.singular}.`));
    }
  };

  const handleDelete = async (record: FinanceRecord) => {
    setActionError(null);

    const confirmed = window.confirm(`Delete ${labels.singular} "${record.name}"?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteRecord({ variables: { id: record.id } });
    } catch (mutationError) {
      setActionError(getGraphQLErrorMessage(mutationError, `Failed to delete ${labels.singular}.`));
    }
  };

  const dialogInitialValues =
    dialogState?.mode === "edit"
      ? { name: dialogState.record.name, amount: dialogState.record.amount }
      : undefined;

  return (
    <Paper sx={{ p: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h6">{labels.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            Track {labels.title.toLowerCase()} for this project.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setServerError(null);
            setDialogState({ mode: "create" });
          }}
        >
          {labels.add}
        </Button>
      </Stack>

      {actionError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {actionError}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error">Failed to load {labels.title.toLowerCase()}.</Alert>
      )}

      {!loading && !error && records.length === 0 && (
        <Typography color="text.secondary">{labels.empty}</Typography>
      )}

      {!loading && !error && records.length > 0 && (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Added by</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id} hover>
                  <TableCell>{record.name}</TableCell>
                  <TableCell align="right">{formatCurrency(record.amount)}</TableCell>
                  <TableCell>{record.creator.name}</TableCell>
                  <TableCell align="right">
                    {canModify(record) ? (
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title={`Edit ${labels.singular}`}>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setServerError(null);
                              setDialogState({ mode: "edit", record });
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={`Delete ${labels.singular}`}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(record)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <FinanceRecordDialog
        open={dialogState !== null}
        mode={dialogState?.mode ?? "create"}
        title={dialogState?.mode === "edit" ? labels.editTitle : labels.createTitle}
        initialValues={dialogInitialValues}
        loading={creating || updating}
        serverError={serverError}
        onClose={() => setDialogState(null)}
        onSubmit={dialogState?.mode === "edit" ? handleUpdate : handleCreate}
      />
    </Paper>
  );
}
