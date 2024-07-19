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
exports.deleteProductService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const deleteProductService = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield prisma_1.default.product.findFirst({
            where: { id },
        });
        if (!product) {
            throw new Error("product not found");
        }
        const user = yield prisma_1.default.user.findFirst({
            where: { id: Number(userId) },
        });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.role !== "SUPERADMIN") {
            throw new Error("Unauthorized Access");
        }
        yield prisma_1.default.product.update({
            where: { id },
            data: {
                isAvailable: false,
            },
        });
        return {
            msg: "Delete Product Success!",
        };
    }
    catch (error) {
        throw error;
    }
});
exports.deleteProductService = deleteProductService;
