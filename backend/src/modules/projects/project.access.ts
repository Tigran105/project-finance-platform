import { prisma } from "../../config/prisma.js";
import { AppError } from "../../common/errors/app-error.js";

export async function getProjectOrThrow(projectId: string) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new AppError("Project not found", "NOT_FOUND");
  }

  return project;
}

export async function assertProjectOwner(projectId: string, userId: string) {
  const project = await getProjectOrThrow(projectId);

  if (project.creatorId !== userId) {
    throw new AppError("Only project owner can perform this action", "FORBIDDEN");
  }

  return project;
}

export async function assertProjectAccess(projectId: string, userId: string) {
  const project = await getProjectOrThrow(projectId);

  if (project.creatorId === userId) {
    return project;
  }

  const membership = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  if (!membership) {
    throw new AppError("You do not have access to this project", "FORBIDDEN");
  }

  return project;
}
