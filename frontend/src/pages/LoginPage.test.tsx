import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LOGIN_MUTATION } from "../graphql/mutations/auth";
import { ME_QUERY } from "../graphql/queries/auth";
import { LoginPage } from "./LoginPage";
import { mockAuthPayload } from "../test/fixtures/auth";
import { renderWithProviders } from "../test/renderWithProviders";

const navigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();

  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    navigate.mockReset();
  });

  it("shows validation errors when submitted empty", async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />);

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("shows a server error when login fails", async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />, {
      mocks: [
        {
          request: {
            query: LOGIN_MUTATION,
            variables: {
              input: {
                email: "jane@example.com",
                password: "wrong-password",
              },
            },
          },
          error: new Error("Invalid email or password"),
        },
      ],
    });

    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Invalid email or password")).toBeInTheDocument();
  });

  it("stores the session and navigates after a successful login", async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />, {
      mocks: [
        {
          request: {
            query: LOGIN_MUTATION,
            variables: {
              input: {
                email: "jane@example.com",
                password: "secret123",
              },
            },
          },
          result: {
            data: {
              login: mockAuthPayload,
            },
          },
        },
        // 2. ADD THE ME_QUERY MOCK HERE TO CATCH THE AUTOMATIC POST-LOGIN FETCH
        {
          request: {
            query: ME_QUERY,
            variables: {},
          },
          result: {
            data: {
              me: {
                __typename: "User",
                id: "user-id-123",
                name: "Jane Doe",
                email: "jane@example.com",
              },
            },
          },
        },
      ],
    });

    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/projects", { replace: true });
    });

    expect(localStorage.getItem("auth_token")).toBe(mockAuthPayload.token);
  });
});