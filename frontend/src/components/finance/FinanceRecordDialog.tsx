import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { financeRecordSchema, type FinanceRecordFormValues } from "@/validation/finance";

type FinanceRecordDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  title: string;
  initialValues?: FinanceRecordFormValues;
  loading?: boolean;
  serverError?: string | null;
  onClose: () => void;
  onSubmit: (values: FinanceRecordFormValues) => void;
};

const emptyFormValues: FinanceRecordFormValues = {
  name: "",
  amount: Number.NaN,
};

export function FinanceRecordDialog({
  open,
  mode,
  title,
  initialValues,
  loading = false,
  serverError = null,
  onClose,
  onSubmit,
}: FinanceRecordDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FinanceRecordFormValues>({
    resolver: yupResolver(financeRecordSchema),
    defaultValues: emptyFormValues,
  });

  useEffect(() => {
    if (open) {
      reset(initialValues ?? emptyFormValues);
    }
  }, [open, initialValues, reset]);

  const handleClose = () => {
    if (loading) {
      return;
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}

          <TextField
            {...register("name")}
            label="Name"
            fullWidth
            margin="normal"
            autoFocus
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />

          <TextField
            {...register("amount", { valueAsNumber: true })}
            label="Amount"
            type="number"
            inputProps={{ min: 0, step: "0.01" }}
            fullWidth
            margin="normal"
            error={Boolean(errors.amount)}
            helperText={errors.amount?.message}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : mode === "create" ? "Add" : "Save changes"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
