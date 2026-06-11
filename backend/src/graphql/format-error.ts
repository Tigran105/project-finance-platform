import type { GraphQLFormattedError } from "graphql";
import { unwrapResolverError } from "@apollo/server/errors";

import { AppError } from "../common/errors/app-error.js";
import { env } from "../config/env.js";

export function formatGraphQLError(
  formattedError: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError {
  const originalError = unwrapResolverError(error);

  if (originalError instanceof AppError) {
    return {
      ...formattedError,
      message: originalError.message,
      extensions: {
        ...formattedError.extensions,
        code: originalError.code,
      },
    };
  }

  if (env.isProduction) {
    return {
      message: "Internal server error",
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    };
  }

  return formattedError;
}
