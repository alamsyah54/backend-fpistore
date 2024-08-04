import { NextFunction, Request, Response } from "express";
import { createOrderService } from "../services/transaction/order/create-order.service";

export class OrderController {
  async createOrderController(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await createOrderService(req.body);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
