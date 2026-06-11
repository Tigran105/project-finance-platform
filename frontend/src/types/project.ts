import type { User } from "@/types/auth";

export type ProjectMember = {
  id: string;
  projectId: string;
  userId: string;
  createdAt: string;
  user: User;
};

export type Project = {
  id: string;
  name: string;
  location: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  creator: User;
  members: ProjectMember[];
};

export type CreateProjectInput = {
  name: string;
  location: string;
};

export type UpdateProjectInput = {
  name?: string;
  location?: string;
};
