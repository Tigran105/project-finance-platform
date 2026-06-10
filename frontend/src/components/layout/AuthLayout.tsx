import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: 4,
        background: "linear-gradient(135deg, #e3f2fd 0%, #f5f7fa 50%, #e8f5e9 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <AccountBalanceWalletOutlinedIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>

          {children}

          {footer && (
            <Box sx={{ mt: 3, textAlign: "center" }}>{footer}</Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
