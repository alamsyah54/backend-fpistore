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
exports.updateProductService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const defaultDir = "../../../docs/images";
const updateProductService = (id, body, userId, file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, feature } = body;
        const product = yield prisma_1.default.product.findFirst({
            where: { id },
        });
        if (!product) {
            throw new Error("Product not found");
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
        if (name) {
            const productName = yield prisma_1.default.product.findFirst({
                where: { name: { equals: name } },
            });
            if (productName && productName.id !== id) {
                throw new Error("Product name already in use");
            }
        }
        if (file) {
            body.image = `/images/${file.filename}`;
            const imagePath = (0, path_1.join)(__dirname, "../../../docs" + product.image);
            if (fs_1.default.existsSync(imagePath)) {
                fs_1.default.unlinkSync(imagePath);
            }
        }
        const updatedBody = Object.assign(Object.assign({}, body), { feature: feature !== undefined ? feature : undefined });
        const data = Object.assign(Object.assign({}, updatedBody), { feature: feature !== undefined ? feature : undefined });
        return yield prisma_1.default.product.update({
            where: { id },
            data: data,
        });
    }
    catch (error) {
        if (file) {
            const imagePath = (0, path_1.join)(__dirname, defaultDir + file.filename);
            if (fs_1.default.existsSync(imagePath)) {
                fs_1.default.unlinkSync(imagePath);
            }
        }
        throw error;
    }
});
exports.updateProductService = updateProductService;
