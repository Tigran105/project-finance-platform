import { useQuery } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { MyInvitationsPanel } from "@/components/invitations/MyInvitationsPanel";
import { AppLayout } from "@/components/layout/AppLayout";
import { PROJECTS_QUERY } from "@/graphql/queries/projects";
import type { Project } from "@/types/project";

export function ProjectsPage() {
  const navigate = useNavigate();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data, loading, error } = useQuery<{ projects: Project[] }>(PROJECTS_QUERY);

  const projects = data?.projects ?? [];

  return (
    <AppLayout>
      <Stack spacing={4}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              My projects
            </Typography>
            <Typography color="text.secondary">
              View your projects or create a new one to start tracking finances.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
          >
            New project
          </Button>
        </Stack>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && error && (
          <Alert severity="error">Failed to load projects. Please try again.</Alert>
        )}

        {!loading && !error && projects.length === 0 && (
          <Alert severity="info">
            You do not have any projects yet. Create one or accept a pending invitation below.
          </Alert>
        )}

        {!loading && !error && projects.length > 0 && (
          <Grid container spacing={2}>
            {projects.map((project) => (
              <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardActionArea
                    onClick={() => navigate(`/projects/${project.id}`)}
                    sx={{ height: "100%" }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom noWrap>
                        {project.name}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1.5 }}>
                        <LocationOnOutlinedIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {project.location}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          label={`${project.members.length} member${project.members.length === 1 ? "" : "s"}`}
                          size="small"
                        />
                        <Chip
                          label={`Owner: ${project.creator.name}`}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <MyInvitationsPanel />
      </Stack>

      <CreateProjectDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </AppLayout>
  );
}
