import { User } from "@prisma/client";
import prisma from "../../prisma";
import { comparePassword } from "../../libs/bcrypt";
import { sign } from "jsonwebtoken";
import { appConfig } from "../../utils/config";

const secret = appConfig.secret;

interface BodyPayload extends Pick<User, "email" | "password"> {
  isRememberMe: boolean;
}

export const signInService = async (body: BodyPayload) => {
  try {
    const { email, password, isRememberMe } = body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const accessToken = sign({ id: user.id }, secret, {
      expiresIn: "15m",
    });

    const refreshTokenExpiresIn = isRememberMe ? "7d" : "24h";
    const refreshToken = sign({ id: user.id }, secret, {
      expiresIn: refreshTokenExpiresIn,
    });

    const expiresAt = new Date(
      Date.now() +
        (isRememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)
    );

    const existingToken = await prisma.refreshToken.findFirst({
      where: { userId: user.id },
    });

    if (existingToken) {
      await prisma.refreshToken.update({
        where: { id: existingToken.id },
        data: {
          token: refreshToken,
          expiresAt,
        },
      });
    } else {
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          createdAt: new Date(),
          expiresAt,
        },
      });
    }

    const userResponse = {
      email: user.email,
      name: user.name,
    };

    return {
      msg: `Sign In Successfully as ${email}`,
      data: userResponse,
      accessToken: accessToken,
    };
  } catch (error) {
    throw error;
  }
};
