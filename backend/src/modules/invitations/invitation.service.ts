import { InvitationStatus } from "@prisma/client";

import { prisma } from "../../config/prisma.js";
import { AppError } from "../../common/errors/app-error.js";
import { normalizeEmail } from "../auth/auth.utils.js";
import { assertProjectOwner } from "../projects/project.access.js";
import { inviteUserSchema } from "./invitation.validation.js";

type InviteUserInput = {
  projectId: string;
  email: string;
};

const projectWithRelationsInclude = {
  creator: true,
  members: {
    include: {
      user: true,
    },
  },
} as const;

export const invitationService = {
  async inviteUser(input: InviteUserInput, ownerId: string) {
    const { error, value } = inviteUserSchema.validate(input);

    if (error) {
      throw new AppError(error.message, "VALIDATION_ERROR");
    }

    const email = normalizeEmail(value.email);

    const project = await assertProjectOwner(value.projectId, ownerId);

    const owner = await prisma.user.findUnique({
      where: {
        id: ownerId,
      },
    });

    if (owner?.email === email) {
      throw new AppError("You cannot invite yourself to your own project", "BAD_REQUEST");
    }

    const invitedUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (invitedUser) {
      const existingMember = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: project.id,
            userId: invitedUser.id,
          },
        },
      });

      if (existingMember) {
        throw new AppError("User is already a project member", "CONFLICT");
      }
    }

    const existingPendingInvitation = await prisma.invitation.findFirst({
      where: {
        projectId: project.id,
        email,
        status: InvitationStatus.PENDING,
      },
    });

    if (existingPendingInvitation) {
      throw new AppError("Active invitation already exists for this project", "CONFLICT");
    }

    return prisma.invitation.create({
      data: {
        projectId: project.id,
        email,
        invitedById: ownerId,
        status: InvitationStatus.PENDING,
      },
      include: {
        project: {
          include: projectWithRelationsInclude,
        },
        invitedBy: true,
      },
    });
  },

  async listMyInvitations(userEmail: string) {
    const email = normalizeEmail(userEmail);

    return prisma.invitation.findMany({
      where: {
        email,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        project: {
          include: projectWithRelationsInclude,
        },
        invitedBy: true,
      },
    });
  },

  async acceptInvitation(invitationId: string, userId: string, userEmail: string) {
    const email = normalizeEmail(userEmail);

    return prisma.$transaction(async (tx) => {
      const invitation = await tx.invitation.findUnique({
        where: {
          id: invitationId,
        },
      });

      if (!invitation) {
        throw new AppError("Invitation not found", "NOT_FOUND");
      }

      if (invitation.email !== email) {
        throw new AppError("You can only respond to your own invitations", "FORBIDDEN");
      }

      if (invitation.status !== InvitationStatus.PENDING) {
        throw new AppError("Invitation is no longer active", "CONFLICT");
      }

      const existingMember = await tx.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: invitation.projectId,
            userId,
          },
        },
      });

      if (!existingMember) {
        await tx.projectMember.create({
          data: {
            projectId: invitation.projectId,
            userId,
          },
        });
      }

      return tx.invitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: InvitationStatus.ACCEPTED,
        },
        include: {
          project: {
            include: projectWithRelationsInclude,
          },
          invitedBy: true,
        },
      });
    });
  },

  async rejectInvitation(invitationId: string, userEmail: string) {
    const email = normalizeEmail(userEmail);

    return prisma.$transaction(async (tx) => {
      const invitation = await tx.invitation.findUnique({
        where: {
          id: invitationId,
        },
      });

      if (!invitation) {
        throw new AppError("Invitation not found", "NOT_FOUND");
      }

      if (invitation.email !== email) {
        throw new AppError("You can only respond to your own invitations", "FORBIDDEN");
      }

      if (invitation.status !== InvitationStatus.PENDING) {
        throw new AppError("Invitation is no longer active", "CONFLICT");
      }

      return tx.invitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: InvitationStatus.REJECTED,
        },
        include: {
          project: {
            include: projectWithRelationsInclude,
          },
          invitedBy: true,
        },
      });
    });
  },
};
