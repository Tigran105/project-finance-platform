import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { Project } from "@/types/project";

type TeamMembersPanelProps = {
  project: Project;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TeamMembersPanel({ project }: TeamMembersPanelProps) {
  const members = project.members;

  return (
    <Paper sx={{ p: 3, height: "100%" }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <GroupOutlinedIcon color="primary" />
        <Typography variant="h6">Team members</Typography>
        <Chip label={members.length} size="small" />
      </Stack>

      <List disablePadding>
        {members.map((member) => {
          const isOwner = member.userId === project.creatorId;

          return (
            <ListItem
              key={member.id}
              disableGutters
              secondaryAction={
                isOwner ? <Chip label="Owner" size="small" color="primary" variant="outlined" /> : null
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "primary.main" }}>{getInitials(member.user.name)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={member.user.name}
                secondary={member.user.email}
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}
