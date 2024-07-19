import { User } from "@prisma/client";
import prisma from "../../prisma";
import { hashPassword } from "../../libs/bcrypt";

export const signUpService = async (body: Omit<User, "id">) => {
  try {
    const { email, password } = body;

    const findUser = await prisma.user.findFirst({
      where: { email },
    });

    if (findUser) {
      throw new Error(`User with email ${email} already exist`);
    }

    if (typeof password !== "string") {
      throw new Error("password must be string");
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        ...body,
        password: hashedPassword,
      },
    });

    return {
      msg: "Sign Up Success",
      user,
    };
  } catch (error) {
    throw error;
  }
};
