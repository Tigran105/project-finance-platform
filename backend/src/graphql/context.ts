import type { PrismaClient, User } from "@prisma/client";
import type { ExpressContextFunctionArgument } from "@apollo/server/express4";

import { prisma } from "../config/prisma.js";
import { verifyAccessToken } from "../modules/auth/auth.utils.js";

export type GraphQLContext = {
  prisma: PrismaClient;
  currentUser: User | null;
};

export async function createGraphQLContext({
  req,
}: ExpressContextFunctionArgument): Promise<GraphQLContext> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return {
      prisma,
      currentUser: null,
    };
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const payload = verifyAccessToken(token);

    const currentUser = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    return {
      prisma,
      currentUser,
    };
  } catch {
    return {
      prisma,
      currentUser: null,
    };
  }
}
