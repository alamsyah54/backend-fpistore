import { NextFunction, Request, Response } from "express";
import { createProductService } from "../services/product/create-product.service";
import { getProductsService } from "../services/product/get-products.service";
import { getProductService } from "../services/product/get-product.service";
import { updateProductService } from "../services/product/update-product.service";
import { deleteProductService } from "../services/product/delete-product.service";

export class ProductController {
  async createProductController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files?.length) {
        throw new Error("no image uploaded");
      }

      const result = await createProductService(req.body, files[0]);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getProductsController(req: Request, res: Response, next: NextFunction) {
    try {
      const query = {
        take: parseInt(req.query.take as string) || 8,
        page: parseInt(req.query.page as string) || 1,
        sortBy: parseInt(req.query.sortBy as string) || "name",
        sortOrder: parseInt(req.query.sortOrder as string) || "desc",
        search: req.query.search as string,
      };

      const result = await getProductsService(query);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getProductController(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      const result = await getProductService(Number(id));

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async updateProductController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      const files = req.files as Express.Multer.File[];
      const userId = res.locals.user.id;

      const result = await updateProductService(
        Number(id),
        req.body,
        Number(userId),
        files[0]
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteProductController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      const userId = res.locals.user.id;

      const result = await deleteProductService(Number(id), Number(userId));

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
