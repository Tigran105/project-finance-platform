import type { User } from "@/types/auth";
import type { Project } from "@/types/project";

export type InvitationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type Invitation = {
  id: string;
  projectId: string;
  email: string;
  status: InvitationStatus;
  invitedById: string;
  createdAt: string;
  updatedAt: string;
  project: Project;
  invitedBy: User;
};

export type InviteUserInput = {
  projectId: string;
  email: string;
};
