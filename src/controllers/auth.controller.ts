import { NextFunction, Request, Response } from "express";
import { signUpService } from "../services/auth/sign-up.service";
import { signInService } from "../services/auth/sign-in.service";
import { getUserService } from "../services/auth/get-user.service";

export class AuthController {
  async getUserController(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = await getUserService(Number(id));

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async signUpController(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await signUpService(req.body);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async signInController(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await signInService(req.body);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
