import prisma from "../../prisma";

export const KeepLoginService = async (id: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found!");
    }

    return {
      msg: "Keep Login Success",
    };
  } catch (error) {
    throw error;
  }
};
