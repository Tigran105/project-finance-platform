import { prisma } from "../config/prisma.js";
import { invitationService } from "../modules/invitations/invitation.service.js";
import { cleanDatabase, createTestProject, createTestUser } from "./test-utils.js";

describe("Invitations", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("accepts an invitation and grants project access", async () => {
    const owner = await createTestUser("owner.invite@example.com", "Owner");
    const invited = await createTestUser("member.invite@example.com", "Member");
    const project = await createTestProject(owner.user.id);

    const invitation = await invitationService.inviteUser(
      {
        projectId: project!.id,
        email: invited.user.email,
      },
      owner.user.id,
    );

    const accepted = await invitationService.acceptInvitation(
      invitation.id,
      invited.user.id,
      invited.user.email,
    );

    expect(accepted.status).toBe("ACCEPTED");

    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: project!.id,
          userId: invited.user.id,
        },
      },
    });

    expect(membership).toBeTruthy();
  });

  it("rejects an invitation and does not grant project access", async () => {
    const owner = await createTestUser("owner.reject@example.com", "Owner");
    const invited = await createTestUser("member.reject@example.com", "Member");
    const project = await createTestProject(owner.user.id);

    const invitation = await invitationService.inviteUser(
      {
        projectId: project!.id,
        email: invited.user.email,
      },
      owner.user.id,
    );

    const rejected = await invitationService.rejectInvitation(invitation.id, invited.user.email);

    expect(rejected.status).toBe("REJECTED");

    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: project!.id,
          userId: invited.user.id,
        },
      },
    });

    expect(membership).toBeNull();
  });

  it("prevents duplicate active invitations", async () => {
    const owner = await createTestUser("owner.duplicate@example.com", "Owner");
    const invited = await createTestUser("member.duplicate@example.com", "Member");
    const project = await createTestProject(owner.user.id);

    await invitationService.inviteUser(
      {
        projectId: project!.id,
        email: invited.user.email,
      },
      owner.user.id,
    );

    await expect(
      invitationService.inviteUser(
        {
          projectId: project!.id,
          email: invited.user.email,
        },
        owner.user.id,
      ),
    ).rejects.toThrow("Active invitation already exists for this project");
  });
});
