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
import { LOGIN_MUTATION } from "@/graphql/mutations/auth";
import type { AuthPayload, LoginInput } from "@/types/auth";
import { getGraphQLErrorMessage } from "@/utils/graphql-error";
import { loginSchema, type LoginFormValues } from "@/validation/auth";

import { AuthLayout } from "@/components/layout/AuthLayout";

export function LoginPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [login, { loading }] = useMutation<{ login: AuthPayload }, { input: LoginInput }>(
    LOGIN_MUTATION,
  );

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    try {
      const { data } = await login({
        variables: {
          input: {
            email: values.email.trim(),
            password: values.password,
          },
        },
      });

      if (!data?.login) {
        setServerError("Login failed. Please try again.");
        return;
      }

      setSession(data.login);
      navigate("/projects", { replace: true });
    } catch (error) {
      setServerError(getGraphQLErrorMessage(error, "Login failed. Please try again."));
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your project finances"
      footer={
        <Typography variant="body2" color="text.secondary">
          Don&apos;t have an account?{" "}
          <Link component={RouterLink} to="/register" underline="hover">
            Create one
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
          autoComplete="current-password"
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
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </Box>
    </AuthLayout>
  );
}
