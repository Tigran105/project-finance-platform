import { prisma } from "../config/prisma.js";
import { requireAuth } from "../common/auth/require-auth.js";
import { authService } from "../modules/auth/auth.service.js";
import { cleanDatabase } from "./test-utils.js";

describe("Authentication", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("registers a user", async () => {
    const result = await authService.register({
      name: "Davit",
      email: "davit.auth@example.com",
      password: "123456",
    });

    expect(result.token).toBeDefined();
    expect(result.user.email).toBe("davit.auth@example.com");
    expect(result.user.passwordHash).not.toBe("123456");
  });

  it("logs in a user", async () => {
    await authService.register({
      name: "Davit",
      email: "davit.login@example.com",
      password: "123456",
    });

    const result = await authService.login({
      email: "davit.login@example.com",
      password: "123456",
    });

    expect(result.token).toBeDefined();
    expect(result.user.email).toBe("davit.login@example.com");
  });

  it("blocks protected operations without authentication", () => {
    expect(() =>
      requireAuth({
        prisma,
        currentUser: null,
      }),
    ).toThrow("Authentication required");
  });
});
