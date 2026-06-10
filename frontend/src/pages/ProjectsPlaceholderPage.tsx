import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/auth/AuthContext";

export function ProjectsPlaceholderPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Project Finance Platform
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.name}
          </Typography>
          <Button color="inherit" startIcon={<LogoutOutlinedIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            You are signed in
          </Typography>
          <Typography color="text.secondary">
            Project dashboard and management views will be added in the next step.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
