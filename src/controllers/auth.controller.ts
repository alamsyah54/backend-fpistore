import { NextFunction, Request, Response } from "express";
import { signUpService } from "../services/auth/sign-up.service";
import { signInService } from "../services/auth/sign-in.service";
import { KeepLoginService } from "../services/auth/keep-login.service";
import { refreshTokenService } from "../services/auth/refresh-token.service";

export class AuthController {
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

  async keepLoginController(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.user.id;
      console.log("reslocals", res.locals);
      const result = await KeepLoginService(Number(id));

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async refreshTokenController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = req.headers.authorization?.split(" ")[1] as string;
      const result = await refreshTokenService(token);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
