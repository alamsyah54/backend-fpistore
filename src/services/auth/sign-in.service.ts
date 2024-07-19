import { User } from "@prisma/client";
import prisma from "../../prisma";
import { comparePassword } from "../../libs/bcrypt";
import { appConfig } from "../../utils/config";
import { sign } from "jsonwebtoken";

export const signInService = async (body: Pick<User, "email" | "password">) => {
  try {
    const { email, password } = body;

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

    const refreshToken = sign({ id: user.id }, appConfig.secret, {
      expiresIn: "1d",
    });

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
      msg: `Login success as ${email}`,
      token: accessToken,
    };
  } catch (error) {
    throw error;
  }
};
