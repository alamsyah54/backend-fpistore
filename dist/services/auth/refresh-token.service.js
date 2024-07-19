"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../../utils/config");
const refreshTokenService = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = (0, jsonwebtoken_1.verify)(accessToken, config_1.appConfig.secret);
        const tokenRecord = yield prisma_1.default.refreshToken.findFirst({
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
        const decodedRefreshToken = (0, jsonwebtoken_1.verify)(tokenRecord.token, config_1.appConfig.secret);
        if (decodedRefreshToken.id !== decoded.id) {
            throw new Error("Invalid refresh token");
        }
        const user = yield prisma_1.default.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user) {
            throw new Error("User not found");
        }
        const newAccessToken = (0, jsonwebtoken_1.sign)({ id: user.id }, config_1.appConfig.secret, {
            expiresIn: "15m",
        });
        return {
            msg: "Token refreshed successfully",
            accessToken: newAccessToken,
        };
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            throw new Error("Access token has expired, please sign in again");
        }
        else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            throw new Error("Invalid access token");
        }
        else {
            console.error("Refresh Token Error:", error);
            throw new Error("An error occurred during token refresh.");
        }
    }
});
exports.refreshTokenService = refreshTokenService;
