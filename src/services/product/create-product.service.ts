import { join } from "path";
import prisma from "../../prisma";
import fs from "fs";

const defaultDir = "../../../public/images";

interface CreateProductBody {
  userId: string;
  description: string;
  feature: string;
  name: string;
  price: number;
  stock: number;
  color: string;
}

export const createProductService = async (
  body: CreateProductBody,
  file: Express.Multer.File
) => {
  let imagePath: string;

  try {
    const {
      userId,
      description,
      feature: featureString,
      name,
      price,
      stock,
      color,
    } = body;

    const result = await prisma.$transaction(async (prisma) => {
      const findProduct = await prisma.product.findFirst({
        where: { name },
      });

      if (findProduct) {
        throw new Error("Product already exists");
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

      let feature: string[] = [];
      if (featureString) {
        try {
          feature = JSON.parse(featureString);
          if (!Array.isArray(feature)) {
            throw new Error("Feature must be an array");
          }
        } catch (error) {
          throw new Error("Invalid JSON format for feature");
        }
      }

      if (file) {
        imagePath = `/images/${file.filename}`;
      }

      const createProduct = await prisma.product.create({
        data: {
          name,
          description,
          feature: feature as any,
          image: imagePath,
          price: Number(price),
          stock: Number(stock),
          color,
        },
      });

      return createProduct;
    });

    return {
      msg: "Product created!",
      product: result,
    };
  } catch (error) {
    if (file) {
      const imagePath = join(__dirname, defaultDir, file.filename);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    throw error;
  }
};
