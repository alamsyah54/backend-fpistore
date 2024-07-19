import prisma from "../../prisma";

export const getProductService = async (id: number) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id,
        isAvailable: true,
      },
      include: {
        discount: true,
      },
    });

    return product;
  } catch (error) {
    throw error;
  }
};
