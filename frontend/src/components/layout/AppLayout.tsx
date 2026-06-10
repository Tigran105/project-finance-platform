import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useAuth } from "@/auth/AuthContext";

type AppLayoutProps = {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
};

export function AppLayout({ children, maxWidth = "lg" }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <AccountBalanceWalletOutlinedIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/projects"
            sx={{
              flexGrow: 1,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Project Finance Platform
          </Typography>
          <Typography variant="body2" sx={{ mr: 2, display: { xs: "none", sm: "block" } }}>
            {user?.name}
          </Typography>
          <Button color="inherit" startIcon={<LogoutOutlinedIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth={maxWidth} sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
