import type { User } from "@prisma/client";

import { AppError } from "../errors/app-error.js";
import type { GraphQLContext } from "../../graphql/context.js";

export function requireAuth(context: GraphQLContext): User {
  if (!context.currentUser) {
    throw new AppError("Authentication required", "UNAUTHENTICATED");
  }

  return context.currentUser;
}
