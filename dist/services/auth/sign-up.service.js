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
exports.signUpService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const bcrypt_1 = require("../../libs/bcrypt");
const signUpService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = body;
        const findUser = yield prisma_1.default.user.findFirst({
            where: { email },
        });
        if (findUser) {
            throw new Error(`User with email ${email} already exist`);
        }
        if (typeof password !== "string") {
            throw new Error("password must be string");
        }
        const hashedPassword = yield (0, bcrypt_1.hashPassword)(password);
        const user = yield prisma_1.default.user.create({
            data: Object.assign(Object.assign({}, body), { password: hashedPassword, isVerified: true }),
        });
        return {
            msg: "Sign Up Success",
            user,
        };
    }
    catch (error) {
        throw error;
    }
});
exports.signUpService = signUpService;
