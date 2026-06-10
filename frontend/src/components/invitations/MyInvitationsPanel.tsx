import { useMutation, useQuery } from "@apollo/client";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ACCEPT_INVITATION_MUTATION,
  REJECT_INVITATION_MUTATION,
} from "@/graphql/mutations/invitations";
import { MY_INVITATIONS_QUERY } from "@/graphql/queries/invitations";
import { PROJECTS_QUERY } from "@/graphql/queries/projects";
import type { Invitation, InvitationStatus } from "@/types/invitation";
import { getGraphQLErrorMessage } from "@/utils/graphql-error";

const statusColor: Record<InvitationStatus, "default" | "warning" | "success" | "error"> = {
  PENDING: "warning",
  ACCEPTED: "success",
  REJECTED: "error",
};

export function MyInvitationsPanel() {
  const navigate = useNavigate();
  const [actionError, setActionError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data, loading, error } = useQuery<{ myInvitations: Invitation[] }>(MY_INVITATIONS_QUERY);

  const mutationOptions = {
    refetchQueries: [{ query: MY_INVITATIONS_QUERY }, { query: PROJECTS_QUERY }],
  };

  const [acceptInvitation] = useMutation(ACCEPT_INVITATION_MUTATION, mutationOptions);
  const [rejectInvitation] = useMutation(REJECT_INVITATION_MUTATION, mutationOptions);

  const invitations = data?.myInvitations ?? [];
  const pendingInvitations = invitations.filter((invitation) => invitation.status === "PENDING");

  const handleAccept = async (invitationId: string, projectId: string) => {
    setActionError(null);
    setProcessingId(invitationId);

    try {
      await acceptInvitation({ variables: { id: invitationId } });
      navigate(`/projects/${projectId}`);
    } catch (mutationError) {
      setActionError(getGraphQLErrorMessage(mutationError, "Failed to accept invitation."));
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (invitationId: string) => {
    setActionError(null);
    setProcessingId(invitationId);

    try {
      await rejectInvitation({ variables: { id: invitationId } });
    } catch (mutationError) {
      setActionError(getGraphQLErrorMessage(mutationError, "Failed to reject invitation."));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h6">My invitations</Typography>
          <Typography variant="body2" color="text.secondary">
            Review and respond to project invitations sent to your email.
          </Typography>
        </Box>
        {pendingInvitations.length > 0 && (
          <Chip label={`${pendingInvitations.length} pending`} color="warning" size="small" />
        )}
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
        <Alert severity="error">Failed to load invitations. Please try again.</Alert>
      )}

      {!loading && !error && invitations.length === 0 && (
        <Typography color="text.secondary">No invitations yet.</Typography>
      )}

      {!loading && !error && invitations.length > 0 && (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Project</TableCell>
                <TableCell>Invited by</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invitations.map((invitation) => (
                <TableRow key={invitation.id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>{invitation.project.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {invitation.project.location}
                    </Typography>
                  </TableCell>
                  <TableCell>{invitation.invitedBy.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={invitation.status}
                      color={statusColor[invitation.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {invitation.status === "PENDING" ? (
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircleOutlineIcon />}
                          disabled={processingId === invitation.id}
                          onClick={() => handleAccept(invitation.id, invitation.projectId)}
                        >
                          Accept
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<HighlightOffIcon />}
                          disabled={processingId === invitation.id}
                          onClick={() => handleReject(invitation.id)}
                        >
                          Reject
                        </Button>
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
    </Paper>
  );
}
