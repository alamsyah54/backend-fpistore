import { User } from "@prisma/client";
import prisma from "../../prisma";
import { comparePassword } from "../../libs/bcrypt";
import { appConfig } from "../../utils/config";
import { sign } from "jsonwebtoken";

interface BodyPayload extends Pick<User, "email" | "password"> {
  isRememberMe: boolean;
}

export const signInService = async (body: BodyPayload) => {
  try {
    const { email, password, isRememberMe } = body;

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new Error("Incorrect Email Address or Password");
    }

    const isPasswordValid = await comparePassword(
      String(password),
      String(user.password)
    );

    if (!isPasswordValid) {
      throw new Error("Incorrect Password");
    }

    const accessToken = sign({ id: user.id }, appConfig.secret, {
      expiresIn: "15m",
    });

    let refreshToken;

    if (!isRememberMe) {
      refreshToken = sign({ id: user.id }, appConfig.secret, {
        expiresIn: "1d",
      });
    } else {
      refreshToken = sign({ id: user.id }, appConfig.secret, {
        expiresIn: "7d",
      });
    }

    const existingToken = await prisma.refreshToken.findFirst({
      where: { userId: user.id },
    });

    if (existingToken) {
      await prisma.refreshToken.update({
        where: { id: existingToken.id },
        data: { token: refreshToken },
      });
    } else {
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
        },
      });
    }

    return {
      msg: `Sign In Successfully as ${email}`,
      token: accessToken,
    };
  } catch (error) {
    throw error;
  }
};
