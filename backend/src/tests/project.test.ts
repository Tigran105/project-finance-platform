import { prisma } from "../config/prisma.js";
import { projectService } from "../modules/projects/project.service.js";
import { cleanDatabase, createTestProject, createTestUser } from "./test-utils.js";

describe("Projects", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("updates a project when requested by the owner", async () => {
    const owner = await createTestUser("owner.project@example.com", "Owner");
    const project = await createTestProject(owner.user.id);

    const updated = await projectService.updateProject(
      project!.id,
      {
        name: "Updated Project",
        location: "Batumi",
      },
      owner.user.id,
    );

    expect(updated?.name).toBe("Updated Project");
    expect(updated?.location).toBe("Batumi");
    expect(updated?.creator.id).toBe(owner.user.id);
  });

  it("prevents non-owners from updating a project", async () => {
    const owner = await createTestUser("owner.update@example.com", "Owner");
    const member = await createTestUser("member.update@example.com", "Member");
    const project = await createTestProject(owner.user.id);

    await prisma.projectMember.create({
      data: {
        projectId: project!.id,
        userId: member.user.id,
      },
    });

    await expect(
      projectService.updateProject(
        project!.id,
        {
          name: "Blocked Update",
        },
        member.user.id,
      ),
    ).rejects.toThrow("Only project owner can perform this action");
  });

  it("deletes a project when requested by the owner", async () => {
    const owner = await createTestUser("owner.delete@example.com", "Owner");
    const project = await createTestProject(owner.user.id);

    const deleted = await projectService.deleteProject(project!.id, owner.user.id);

    expect(deleted).toBe(true);

    const remainingProject = await prisma.project.findUnique({
      where: {
        id: project!.id,
      },
    });

    expect(remainingProject).toBeNull();
  });

  it("prevents non-owners from deleting a project", async () => {
    const owner = await createTestUser("owner.delete-block@example.com", "Owner");
    const member = await createTestUser("member.delete-block@example.com", "Member");
    const project = await createTestProject(owner.user.id);

    await prisma.projectMember.create({
      data: {
        projectId: project!.id,
        userId: member.user.id,
      },
    });

    await expect(projectService.deleteProject(project!.id, member.user.id)).rejects.toThrow(
      "Only project owner can perform this action",
    );
  });
});
