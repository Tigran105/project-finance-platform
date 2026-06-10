import { prisma } from "../../config/prisma.js";
import { AppError } from "../../common/errors/app-error.js";
import {
  comparePassword,
  hashPassword,
  normalizeEmail,
  signAccessToken,
} from "./auth.utils.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export const authService = {
  async register(input: RegisterInput) {
    const { error, value } = registerSchema.validate(input);

    if (error) {
      throw new AppError(error.message, "VALIDATION_ERROR");
    }

    const email = normalizeEmail(value.email);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("User with this email already exists", "CONFLICT");
    }

    const passwordHash = await hashPassword(value.password);

    const user = await prisma.user.create({
      data: {
        name: value.name.trim(),
        email,
        passwordHash,
      },
    });

    const token = signAccessToken({
      userId: user.id,
    });

    return {
      token,
      user,
    };
  },

  async login(input: LoginInput) {
    const { error, value } = loginSchema.validate(input);

    if (error) {
      throw new AppError(error.message, "VALIDATION_ERROR");
    }

    const email = normalizeEmail(value.email);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Invalid email or password", "UNAUTHORIZED");
    }

    const isPasswordValid = await comparePassword(value.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", "UNAUTHORIZED");
    }

    const token = signAccessToken({
      userId: user.id,
    });

    return {
      token,
      user,
    };
  },
};
