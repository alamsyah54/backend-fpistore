import { Router } from "express";
import { OrderController } from "../controllers/order.controller";

export class OrderRouter {
  private router: Router;
  private orderController: OrderController;

  constructor() {
    this.router = Router();
    this.orderController = new OrderController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/", this.orderController.createOrderController);
  }

  public getRouter(): Router {
    return this.router;
  }
}
