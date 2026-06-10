import { useQuery } from "@apollo/client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useParams } from "react-router-dom";

import { InviteUserForm } from "@/components/invitations/InviteUserForm";
import { AppLayout } from "@/components/layout/AppLayout";
import { TeamMembersPanel } from "@/components/projects/TeamMembersPanel";
import { useAuth } from "@/auth/AuthContext";
import { PROJECT_QUERY } from "@/graphql/queries/projects";
import type { Project } from "@/types/project";

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();

  const { data, loading, error } = useQuery<{ project: Project }>(PROJECT_QUERY, {
    variables: { id: projectId },
    skip: !projectId,
  });

  const project = data?.project;
  const isOwner = project && user ? project.creatorId === user.id : false;

  return (
    <AppLayout>
      <Stack spacing={3}>
        <Box>
          <Button
            component={RouterLink}
            to="/projects"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2 }}
          >
            Back to projects
          </Button>

          <Breadcrumbs sx={{ mb: 1 }}>
            <Link component={RouterLink} to="/projects" underline="hover" color="inherit">
              Projects
            </Link>
            <Typography color="text.primary">{project?.name ?? "Project"}</Typography>
          </Breadcrumbs>
        </Box>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && error && (
          <Alert severity="error">
            {error.message.includes("FORBIDDEN") || error.message.includes("access")
              ? "You do not have access to this project."
              : "Failed to load project. It may not exist."}
          </Alert>
        )}

        {!loading && !error && project && (
          <>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom>
                {project.name}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <LocationOnOutlinedIcon fontSize="small" color="action" />
                <Typography color="text.secondary">{project.location}</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Created by {project.creator.name}
              </Typography>
            </Paper>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: isOwner ? 6 : 12 }}>
                <TeamMembersPanel project={project} />
              </Grid>

              {isOwner && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <InviteUserForm projectId={project.id} />
                </Grid>
              )}
            </Grid>

            <Paper sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Expense, income, and budget report tools will be available in the next step.
              </Typography>
            </Paper>
          </>
        )}
      </Stack>
    </AppLayout>
  );
}
