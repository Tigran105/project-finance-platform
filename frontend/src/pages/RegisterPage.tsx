import { useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useAuth } from "@/auth/AuthContext";
import { REGISTER_MUTATION } from "@/graphql/mutations/auth";
import type { AuthPayload, RegisterInput } from "@/types/auth";
import { getGraphQLErrorMessage } from "@/utils/graphql-error";
import { registerSchema, type RegisterFormValues } from "@/validation/auth";

import { AuthLayout } from "@/components/layout/AuthLayout";

export function RegisterPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [registerUser, { loading }] = useMutation<
    { register: AuthPayload },
    { input: RegisterInput }
  >(REGISTER_MUTATION);

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);

    try {
      const { data } = await registerUser({
        variables: {
          input: {
            name: values.name.trim(),
            email: values.email.trim(),
            password: values.password,
          },
        },
      });

      if (!data?.register) {
        setServerError("Registration failed. Please try again.");
        return;
      }

      setSession(data.register);
      navigate("/projects", { replace: true });
    } catch (error) {
      setServerError(getGraphQLErrorMessage(error, "Registration failed. Please try again."));
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join the platform to track project budgets"
      footer={
        <Typography variant="body2" color="text.secondary">
          Already have an account?{" "}
          <Link component={RouterLink} to="/login" underline="hover">
            Sign in
          </Link>
        </Typography>
      }
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <TextField
          {...register("name")}
          label="Full name"
          autoComplete="name"
          fullWidth
          margin="normal"
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />

        <TextField
          {...register("email")}
          label="Email"
          type="email"
          autoComplete="email"
          fullWidth
          margin="normal"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />

        <TextField
          {...register("password")}
          label="Password"
          type="password"
          autoComplete="new-password"
          fullWidth
          margin="normal"
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </Box>
    </AuthLayout>
  );
}
