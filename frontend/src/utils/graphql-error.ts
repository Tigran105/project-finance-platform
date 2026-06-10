import { ApolloError } from "@apollo/client";

export function getGraphQLErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof ApolloError) {
    const graphQLError = error.graphQLErrors[0]?.message;
    if (graphQLError) {
      return graphQLError;
    }

    if (error.networkError?.message) {
      return error.networkError.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
