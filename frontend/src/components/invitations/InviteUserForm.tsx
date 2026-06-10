import { useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { INVITE_USER_MUTATION } from "@/graphql/mutations/invitations";
import type { Invitation, InviteUserInput } from "@/types/invitation";
import { getGraphQLErrorMessage } from "@/utils/graphql-error";
import { inviteUserSchema, type InviteUserFormValues } from "@/validation/project";

type InviteUserFormProps = {
  projectId: string;
};

export function InviteUserForm({ projectId }: InviteUserFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteUserFormValues>({
    resolver: yupResolver(inviteUserSchema),
    defaultValues: {
      email: "",
    },
  });

  const [inviteUser, { loading }] = useMutation<
    { inviteUser: Invitation },
    { input: InviteUserInput }
  >(INVITE_USER_MUTATION);

  const onSubmit = async (values: InviteUserFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const { data } = await inviteUser({
        variables: {
          input: {
            projectId,
            email: values.email.trim(),
          },
        },
      });

      reset();
      setSuccessMessage(`Invitation sent to ${data?.inviteUser.email}.`);
    } catch (error) {
      setServerError(getGraphQLErrorMessage(error, "Failed to send invitation."));
    }
  };

  return (
    <Paper sx={{ p: 3, height: "100%" }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <MailOutlineIcon color="primary" />
        <Typography variant="h6">Invite team member</Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Send an email invitation to add someone to this project.
      </Typography>

      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {serverError}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          {...register("email")}
          label="Email address"
          type="email"
          fullWidth
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Sending..." : "Send invitation"}
        </Button>
      </Box>
    </Paper>
  );
}
