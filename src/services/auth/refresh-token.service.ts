import prisma from "../../prisma";
import { verify, sign, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { appConfig } from "../../utils/config";

export const refreshTokenService = async (accessToken: string) => {
  try {
    const decoded = verify(accessToken, appConfig.secret) as { id: number };

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

    const decodedRefreshToken = verify(tokenRecord.token, appConfig.secret) as { id: number };

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
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new Error("Access token has expired, please sign in again");
    } else if (error instanceof JsonWebTokenError) {
      throw new Error("Invalid access token");
    } else {
      console.error("Refresh Token Error:", error);
      throw new Error("An error occurred during token refresh.");
    }
  }
};
