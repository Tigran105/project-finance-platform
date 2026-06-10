import { useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { CREATE_PROJECT_MUTATION } from "@/graphql/mutations/projects";
import { PROJECTS_QUERY } from "@/graphql/queries/projects";
import type { CreateProjectInput, Project } from "@/types/project";
import { getGraphQLErrorMessage } from "@/utils/graphql-error";
import { createProjectSchema, type CreateProjectFormValues } from "@/validation/project";

type CreateProjectDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateProjectDialog({ open, onClose }: CreateProjectDialogProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectFormValues>({
    resolver: yupResolver(createProjectSchema),
    defaultValues: {
      name: "",
      location: "",
    },
  });

  const [createProject, { loading }] = useMutation<
    { createProject: Project },
    { input: CreateProjectInput }
  >(CREATE_PROJECT_MUTATION, {
    refetchQueries: [{ query: PROJECTS_QUERY }],
  });

  const handleClose = () => {
    if (loading) {
      return;
    }

    setServerError(null);
    reset();
    onClose();
  };

  const onSubmit = async (values: CreateProjectFormValues) => {
    setServerError(null);

    try {
      await createProject({
        variables: {
          input: {
            name: values.name.trim(),
            location: values.location.trim(),
          },
        },
      });

      reset();
      onClose();
    } catch (error) {
      setServerError(getGraphQLErrorMessage(error, "Failed to create project."));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create new project</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}

          <TextField
            {...register("name")}
            label="Project name"
            fullWidth
            margin="normal"
            autoFocus
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />

          <TextField
            {...register("location")}
            label="Location"
            fullWidth
            margin="normal"
            error={Boolean(errors.location)}
            helperText={errors.location?.message}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Creating..." : "Create project"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
