import { ApolloError } from "@apollo/client";
import { GraphQLError } from "graphql";
import { describe, expect, it } from "vitest";

import { getGraphQLErrorMessage } from "./graphql-error";

describe("getGraphQLErrorMessage", () => {
  it("returns the first GraphQL error message from an ApolloError", () => {
    const error = new ApolloError({
      graphQLErrors: [new GraphQLError("Invalid email or password")],
    });

    expect(getGraphQLErrorMessage(error)).toBe("Invalid email or password");
  });

  it("returns the network error message when GraphQL errors are absent", () => {
    const error = new ApolloError({
      networkError: new Error("Network request failed"),
    });

    expect(getGraphQLErrorMessage(error)).toBe("Network request failed");
  });

  it("returns a generic Error message", () => {
    expect(getGraphQLErrorMessage(new Error("Something broke"))).toBe("Something broke");
  });

  it("returns the fallback for unknown errors", () => {
    expect(getGraphQLErrorMessage(null, "Fallback message")).toBe("Fallback message");
  });
});
