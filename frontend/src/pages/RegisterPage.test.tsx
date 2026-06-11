import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { REGISTER_MUTATION } from "@/graphql/mutations/auth";
// 1. IMPORT YOUR ME QUERY HERE
import { ME_QUERY } from "@/graphql/queries/auth";
import { RegisterPage } from "@/pages/RegisterPage";
import { mockAuthPayload } from "@/test/fixtures/auth";
import { renderWithProviders } from "@/test/renderWithProviders";

const navigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();

  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

describe("RegisterPage", () => {
  beforeEach(() => {
    navigate.mockReset();
  });

  it("shows validation errors for invalid registration input", async () => {
    const user = userEvent.setup();

    renderWithProviders(<RegisterPage />);

    await user.type(screen.getByLabelText("Full name"), "J");
    await user.type(screen.getByLabelText("Email"), "invalid-email");
    await user.type(screen.getByLabelText("Password"), "123");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Name must be at least 2 characters")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
    expect(screen.getByText("Password must be at least 6 characters")).toBeInTheDocument();
  });

  it("registers a user and navigates to projects", async () => {
    const user = userEvent.setup();

    renderWithProviders(<RegisterPage />, {
      mocks: [
        // Mock #1: The registration mutation
        {
          request: {
            query: REGISTER_MUTATION,
            variables: {
              input: {
                name: "Jane Doe",
                email: "jane@example.com",
                password: "secret123",
              },
            },
          },
          result: {
            data: {
              register: mockAuthPayload,
            },
          },
        },
        // Mock #2: The subsequent 'Me' query triggered post-registration
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

    await user.type(screen.getByLabelText("Full name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/projects", { replace: true });
    });

    expect(localStorage.getItem("auth_token")).toBe(mockAuthPayload.token);
  });
});