import prisma from "../../prisma";
import { verify, sign, TokenExpiredError } from "jsonwebtoken";
import { appConfig } from "../../utils/config";

export const refreshTokenService = async (accessToken: string) => {
  try {
    try {
      verify(accessToken, appConfig.secret);
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        const decoded = verify(accessToken, appConfig.secret, {
          ignoreExpiration: true,
        }) as { id: number };

        const tokenRecord = await prisma.refreshToken.findFirst({
          where: {
            userId: decoded.id,
            expiresAt: {
              gte: new Date(),
            },
          },
        });

        if (!tokenRecord) {
          throw new Error("No valid refresh token found for this user");
        }

        const decodedRefreshToken = verify(
          tokenRecord.token,
          appConfig.secret
        ) as { id: number };

        if (decodedRefreshToken.id !== decoded.id) {
          throw new Error("Invalid refresh token");
        }

        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const newAccessToken = sign({ id: user.id }, appConfig.secret, {
          expiresIn: "15m",
        });

        return {
          msg: "Token refreshed successfully",
          accessToken: newAccessToken,
        };
      } else {
        throw new Error("Invalid access token");
      }
    }

    return { msg: "Token is still valid", accessToken };
  } catch (error) {
    throw error;
  }
};
