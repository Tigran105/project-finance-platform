import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "./AuthContext";

export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/projects" replace />;
  }

  return <Outlet />;
}
