import { useMutation } from "@apollo/client";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { DELETE_PROJECT_MUTATION } from "@/graphql/mutations/projects";
import { PROJECTS_QUERY } from "@/graphql/queries/projects";
import { getGraphQLErrorMessage } from "@/utils/graphql-error";

type DeleteProjectDialogProps = {
  projectId: string;
  projectName: string;
  open: boolean;
  onClose: () => void;
};

export function DeleteProjectDialog({
  projectId,
  projectName,
  open,
  onClose,
}: DeleteProjectDialogProps) {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const [deleteProject, { loading }] = useMutation<{ deleteProject: boolean }, { id: string }>(
    DELETE_PROJECT_MUTATION,
    {
      refetchQueries: [{ query: PROJECTS_QUERY }],
    },
  );

  const handleClose = () => {
    if (loading) {
      return;
    }

    setServerError(null);
    onClose();
  };

  const handleDelete = async () => {
    setServerError(null);

    try {
      await deleteProject({ variables: { id: projectId } });
      onClose();
      navigate("/projects", { replace: true });
    } catch (error) {
      setServerError(getGraphQLErrorMessage(error, "Failed to delete project."));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Delete project</DialogTitle>
      <DialogContent>
        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <DialogContentText>
          Are you sure you want to delete <strong>{projectName}</strong>? This action cannot be
          undone and will remove all related expenses, incomes, and invitations.
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleDelete} variant="contained" color="error" disabled={loading}>
          {loading ? "Deleting..." : "Delete project"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
