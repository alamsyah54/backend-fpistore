import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { UserController } from "../controllers/user.controller";

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/:id", verifyToken, this.userController.getUserController);
  }

  public getRouter(): Router {
    return this.router;
  }
}
