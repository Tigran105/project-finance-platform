import type { AuthPayload, User } from "../../types/auth";

export const mockUser: User = {
  id: "user-1",
  name: "Jane Doe",
  email: "jane@example.com",
};

export const mockAuthPayload: AuthPayload = {
  token: "test-jwt-token",
  user: mockUser,
};

export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    ...mockUser,
    ...overrides,
  };
}
