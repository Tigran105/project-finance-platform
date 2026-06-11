import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { ProtectedRoute } from "./ProtectedRoute";

const useAuthMock = vi.hoisted(() => vi.fn());

vi.mock("@/auth/AuthContext", () => ({
  useAuth: useAuthMock,
}));

describe("ProtectedRoute", () => {
  it("redirects unauthenticated users to login", () => {
    useAuthMock.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/projects"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/projects" element={<div>Projects workspace</div>} />
          </Route>
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("renders protected content for authenticated users", () => {
    useAuthMock.mockReturnValue({
      user: { id: "1", name: "Jane", email: "jane@example.com" },
      isAuthenticated: true,
      isLoading: false,
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/projects"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/projects" element={<div>Projects workspace</div>} />
          </Route>
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Projects workspace")).toBeInTheDocument();
  });

  it("shows a loading indicator while auth state is resolving", () => {
    useAuthMock.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/projects"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/projects" element={<div>Projects workspace</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
