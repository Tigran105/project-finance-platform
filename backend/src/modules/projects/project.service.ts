import { prisma } from "../../config/prisma.js";
import { AppError } from "../../common/errors/app-error.js";
import { createProjectSchema, updateProjectSchema } from "./project.validation.js";
import { assertProjectAccess, assertProjectOwner } from "./project.access.js";

type CreateProjectInput = {
  name: string;
  location: string;
};

type UpdateProjectInput = {
  name?: string;
  location?: string;
};

export const projectService = {
  async createProject(input: CreateProjectInput, userId: string) {
    const { error, value } = createProjectSchema.validate(input);

    if (error) {
      throw new AppError(error.message, "VALIDATION_ERROR");
    }

    return prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name: value.name.trim(),
          location: value.location.trim(),
          creatorId: userId,
        },
      });

      await tx.projectMember.create({
        data: {
          projectId: project.id,
          userId,
        },
      });

      return tx.project.findUnique({
        where: {
          id: project.id,
        },
        include: {
          creator: true,
          members: {
            include: {
              user: true,
            },
          },
        },
      });
    });
  },

  async updateProject(projectId: string, input: UpdateProjectInput, userId: string) {
    await assertProjectOwner(projectId, userId);

    const { error, value } = updateProjectSchema.validate(input);

    if (error) {
      throw new AppError(error.message, "VALIDATION_ERROR");
    }

    return prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        ...(value.name !== undefined && { name: value.name.trim() }),
        ...(value.location !== undefined && { location: value.location.trim() }),
      },
      include: {
        creator: true,
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  },

  async deleteProject(projectId: string, userId: string) {
    await assertProjectOwner(projectId, userId);

    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return true;
  },

  async getProject(projectId: string, userId: string) {
    await assertProjectAccess(projectId, userId);

    return prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        creator: true,
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  },

  async listAvailableProjects(userId: string) {
    return prisma.project.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        creator: true,
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  },
};
