import { Product } from "@prisma/client";
import prisma from "../../prisma";
import { join } from "path";
import fs from "fs";

const defaultDir = "../../../public/images";

export const updateProductService = async (
  id: number,
  body: Partial<Product>,
  userId: number,
  file?: Express.Multer.File
) => {
  try {
    const { name, feature } = body;
    const product = await prisma.product.findFirst({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found");
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

    if (name) {
      const productName = await prisma.product.findFirst({
        where: { name: { equals: name } },
      });

      if (productName && productName.id !== id) {
        throw new Error("Product name already in use");
      }
    }

    if (file) {
      body.image = `/images/${file.filename}`;

      const imagePath = join(__dirname, "../../../public" + product.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const updatedBody = {
      ...body,
      feature: feature !== undefined ? feature : undefined,
    };

    const data: Partial<Product> & { feature?: any } = {
      ...updatedBody,
      feature: feature !== undefined ? feature : undefined,
    };

    return await prisma.product.update({
      where: { id },
      data: data,
    });
  } catch (error) {
    if (file) {
      const imagePath = join(__dirname, defaultDir + file.filename);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    throw error;
  }
};
