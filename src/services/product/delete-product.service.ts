import prisma from "../../prisma";

export const deleteProductService = async (id: number, userId: number) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id },
    });

    if (!product) {
      throw new Error("product not found");
    }

    const user = await prisma.user.findFirst({
      where: { id: Number(userId) },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== "SUPERADMIN") {
      throw new Error("Unauthorized Access");
    }

    await prisma.product.update({
      where: { id },
      data: {
        isAvailable: false,
      },
    });

    return {
      msg: "Delete Product Success!",
    };
  } catch (error) {
    throw error;
  }
};
