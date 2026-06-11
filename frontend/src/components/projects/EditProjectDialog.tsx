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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { UPDATE_PROJECT_MUTATION } from "@/graphql/mutations/projects";
import { PROJECT_QUERY, PROJECTS_QUERY } from "@/graphql/queries/projects";
import type { Project, UpdateProjectInput } from "@/types/project";
import { getGraphQLErrorMessage } from "@/utils/graphql-error";
import { createProjectSchema, type UpdateProjectFormValues } from "@/validation/project";

type EditProjectDialogProps = {
  project: Project;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function EditProjectDialog({ project, open, onClose, onSuccess }: EditProjectDialogProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProjectFormValues>({
    resolver: yupResolver(createProjectSchema),
    defaultValues: {
      name: project.name,
      location: project.location,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: project.name,
        location: project.location,
      });
      setServerError(null);
    }
  }, [open, project.location, project.name, reset]);

  const [updateProject, { loading }] = useMutation<
    { updateProject: Project },
    { id: string; input: UpdateProjectInput }
  >(UPDATE_PROJECT_MUTATION, {
    refetchQueries: [
      { query: PROJECTS_QUERY },
      { query: PROJECT_QUERY, variables: { id: project.id } },
    ],
  });

  const handleClose = () => {
    if (loading) {
      return;
    }

    setServerError(null);
    onClose();
  };

  const onSubmit = async (values: UpdateProjectFormValues) => {
    setServerError(null);

    try {
      await updateProject({
        variables: {
          id: project.id,
          input: {
            name: values.name.trim(),
            location: values.location.trim(),
          },
        },
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      setServerError(getGraphQLErrorMessage(error, "Failed to update project."));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit project</DialogTitle>
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
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
