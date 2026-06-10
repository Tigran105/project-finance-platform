import { gql, useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const HEALTH_QUERY = gql`
  query Health {
    health
  }
`;

function App() {
  const { data, loading, error } = useQuery<{ health: string }>(HEALTH_QUERY);

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Project Finance Platform
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Frontend client setup is ready. GraphQL connectivity check:
        </Typography>

        <Box sx={{ minHeight: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {loading && <CircularProgress size={32} />}
          {!loading && error && (
            <Typography color="error">
              Unable to reach the API. Start the backend and verify VITE_GRAPHQL_URL.
            </Typography>
          )}
          {!loading && !error && data && (
            <Typography color="success.main" sx={{ fontWeight: 600 }}>
              API health: {data.health}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default App;
