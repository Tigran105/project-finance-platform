import { useQuery } from "@apollo/client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
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
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

import { useAuth } from "@/auth/AuthContext";
import { BudgetReportPanel } from "@/components/finance/BudgetReportPanel";
import { ExpensesPanel, IncomesPanel } from "@/components/finance/FinancePanels";
import { InviteUserForm } from "@/components/invitations/InviteUserForm";
import { AppLayout } from "@/components/layout/AppLayout";
import { DeleteProjectDialog } from "@/components/projects/DeleteProjectDialog";
import { EditProjectDialog } from "@/components/projects/EditProjectDialog";
import { TeamMembersPanel } from "@/components/projects/TeamMembersPanel";
import { PROJECT_QUERY } from "@/graphql/queries/projects";
import type { Project } from "@/types/project";

type ProjectTab = "team" | "expenses" | "incomes" | "budget";

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ProjectTab>("team");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

        {!loading && !error && project && user && (
          <>
            {successMessage && (
              <Alert severity="success" onClose={() => setSuccessMessage(null)}>
                {successMessage}
              </Alert>
            )}

            <Paper sx={{ p: 3 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "flex-start" }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
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
                </Box>

                {isOwner && (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      startIcon={<EditOutlinedIcon />}
                      onClick={() => setEditDialogOpen(true)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteOutlineIcon />}
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      Delete
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Paper>

            <Paper sx={{ px: { xs: 1, sm: 2 } }}>
              <Tabs
                value={activeTab}
                onChange={(_event, value: ProjectTab) => setActiveTab(value)}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Team" value="team" />
                <Tab label="Expenses" value="expenses" />
                <Tab label="Incomes" value="incomes" />
                <Tab label="Budget report" value="budget" />
              </Tabs>
            </Paper>

            {activeTab === "team" && (
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
            )}

            {activeTab === "expenses" && (
              <ExpensesPanel
                projectId={project.id}
                projectOwnerId={project.creatorId}
                currentUserId={user.id}
              />
            )}

            {activeTab === "incomes" && (
              <IncomesPanel
                projectId={project.id}
                projectOwnerId={project.creatorId}
                currentUserId={user.id}
              />
            )}

            {activeTab === "budget" && <BudgetReportPanel projectId={project.id} />}

            <EditProjectDialog
              project={project}
              open={editDialogOpen}
              onClose={() => setEditDialogOpen(false)}
              onSuccess={() => setSuccessMessage("Project updated successfully.")}
            />

            <DeleteProjectDialog
              projectId={project.id}
              projectName={project.name}
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
            />
          </>
        )}
      </Stack>
    </AppLayout>
  );
}
