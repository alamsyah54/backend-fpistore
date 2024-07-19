import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { ProductController } from "../controllers/product.controller";
import { uploader } from "../libs/uploader";

export class ProductRouter {
  private router: Router;
  private productController: ProductController;

  constructor() {
    this.router = Router();
    this.productController = new ProductController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/",
      verifyToken,
      uploader("IMG", "/images").array("image", 1),
      this.productController.createProductController
    );
    this.router.get("/", this.productController.getProductsController);
    this.router.get("/:id", this.productController.getProductController);
    this.router.patch(
      "/:id",
      verifyToken,
      uploader("IMG", "/images").array("image", 1),
      this.productController.updateProductController
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
