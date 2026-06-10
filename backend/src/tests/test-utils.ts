import { prisma } from "../config/prisma.js";
import { authService } from "../modules/auth/auth.service.js";
import { projectService } from "../modules/projects/project.service.js";

export async function cleanDatabase() {
  await prisma.income.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
}

export async function createTestUser(email: string, name = "Test User") {
  return authService.register({
    name,
    email,
    password: "123456",
  });
}

export async function createTestProject(userId: string) {
  return projectService.createProject(
    {
      name: "Test Project",
      location: "Yerevan",
    },
    userId,
  );
}
