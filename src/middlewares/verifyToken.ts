import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { TokenExpiredError, verify } from "jsonwebtoken";
import { appConfig } from "../utils/config";

const secretKey = appConfig.secret;

interface PayloadToken extends Pick<User, "id"> {}

declare global {
  namespace Express {
    interface Request {
      user?: PayloadToken | null;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({
      msg: "Authorization header is missing",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      msg: "Token is missing",
    });
  }

  verify(token, secretKey, (err, payload) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        return res.status(401).send({ msg: "Token expired", token });
      } else {
        return res
          .status(401)
          .send({ msg: "Invalid token", error: err.message, token });
      }
    }
    res.locals.user = payload as PayloadToken;
    next();
  });
};
