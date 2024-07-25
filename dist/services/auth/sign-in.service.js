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
exports.signInService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const bcrypt_1 = require("../../libs/bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../../utils/config");
const secret = config_1.appConfig.secret;
const signInService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, isRememberMe } = body;
        const user = yield prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordValid = yield (0, bcrypt_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }
        const accessToken = (0, jsonwebtoken_1.sign)({ id: user.id }, secret, {
            expiresIn: "15m",
        });
        const refreshTokenExpiresIn = isRememberMe ? "7d" : "24h";
        const refreshToken = (0, jsonwebtoken_1.sign)({ id: user.id }, secret, {
            expiresIn: refreshTokenExpiresIn,
        });
        const expiresAt = new Date(Date.now() +
            (isRememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000));
        const existingToken = yield prisma_1.default.refreshToken.findFirst({
            where: { userId: user.id },
        });
        if (existingToken) {
            yield prisma_1.default.refreshToken.update({
                where: { id: existingToken.id },
                data: {
                    token: refreshToken,
                    expiresAt,
                },
            });
        }
        else {
            yield prisma_1.default.refreshToken.create({
                data: {
                    token: refreshToken,
                    userId: user.id,
                    createdAt: new Date(),
                    expiresAt,
                },
            });
        }
        const userResponse = {
            email: user.email,
            name: user.name,
        };
        return {
            msg: `Sign In Successfully as ${email}`,
            data: userResponse,
            accessToken: accessToken,
        };
    }
    catch (error) {
        throw error;
    }
});
exports.signInService = signInService;
