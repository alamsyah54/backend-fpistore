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
exports.createProductService = void 0;
const path_1 = require("path");
const prisma_1 = __importDefault(require("../../prisma"));
const fs_1 = __importDefault(require("fs"));
const defaultDir = "../../../public/images";
const createProductService = (body, file) => __awaiter(void 0, void 0, void 0, function* () {
    let imagePath;
    try {
        const { userId, description, feature: featureString, name, price, stock, color, } = body;
        const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const findProduct = yield prisma.product.findFirst({
                where: { name },
            });
            if (findProduct) {
                throw new Error("Product already exists");
            }
            const user = yield prisma.user.findFirst({
                where: { id: Number(userId) },
            });
            if (!user) {
                throw new Error("User not found");
            }
            if (user.role !== "SUPERADMIN") {
                throw new Error("Unauthorized Access");
            }
            let feature = [];
            if (featureString) {
                try {
                    feature = JSON.parse(featureString);
                    if (!Array.isArray(feature)) {
                        throw new Error("Feature must be an array");
                    }
                }
                catch (error) {
                    throw new Error("Invalid JSON format for feature");
                }
            }
            if (file) {
                imagePath = `/images/${file.filename}`;
            }
            const createProduct = yield prisma.product.create({
                data: {
                    name,
                    description,
                    feature: feature,
                    image: imagePath,
                    price: Number(price),
                    stock: Number(stock),
                    color,
                },
            });
            return createProduct;
        }));
        return {
            msg: "Product created!",
            product: result,
        };
    }
    catch (error) {
        if (file) {
            const imagePath = (0, path_1.join)(__dirname, defaultDir, file.filename);
            if (fs_1.default.existsSync(imagePath)) {
                fs_1.default.unlinkSync(imagePath);
            }
        }
        throw error;
    }
});
exports.createProductService = createProductService;
