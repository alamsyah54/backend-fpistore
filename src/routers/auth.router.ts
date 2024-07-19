import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/verifyToken";

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/sign-up", this.authController.signUpController);
    this.router.post("/sign-in", this.authController.signInController);
    this.router.get(
      "/keep-login",
      verifyToken,
      this.authController.keepLoginController
    );
    this.router.post("/refresh", this.authController.refreshTokenController);
  }

  public getRouter(): Router {
    return this.router;
  }
}
