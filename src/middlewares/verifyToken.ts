import { User } from "@prisma/client";
import { appConfig } from "../utils/config";
import { NextFunction, Request, Response } from "express";
import { sign, TokenExpiredError, verify } from "jsonwebtoken";
import prisma from "../prisma";

const secretKey = appConfig.secret;

interface PayloadToken extends Pick<User, "id"> {}

declare global {
  namespace Express {
    interface Request {
      user?: PayloadToken | null;
    }
  }
}

const generateAccessToken = (user: PayloadToken) => {
  return sign(user, secretKey, { expiresIn: "15m" });
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.headers["x-refresh-token"] as string;

  if (!token) {
    return res.status(401).send({
      message: "Token is missing",
    });
  }

  verify(token, secretKey, async (err, payload) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        const expiredPayload = verify(token, secretKey, {
          ignoreExpiration: true,
        }) as PayloadToken;

        const storedToken = await prisma.refreshToken.findFirst({
          where: { userId: expiredPayload.id },
        });

        if (!storedToken) {
          return res.status(401).send({
            message: "Invalid refresh token",
          });
        }

        verify(storedToken.token, secretKey, (refreshErr, refreshPayload) => {
          if (refreshErr) {
            return res.status(401).send({
              message: "Invalid refresh token",
            });
          }

          const userId = (refreshPayload as PayloadToken).id;
          const newAccessToken = generateAccessToken({ id: userId });

          res.setHeader("Authorization", `Bearer ${newAccessToken}`);
          res.locals.user = { id: userId };
          return next();
        });
      } else {
        return res.status(401).send({ message: "Invalid access token" });
      }
    } else {
      res.locals.user = payload as PayloadToken;
      next();
    }
  });
};
