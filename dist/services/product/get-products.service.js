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
exports.getProductsService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const getProductsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, search, sortBy, sortOrder, take } = query;
        const whereClause = {
            name: { contains: search },
            isAvailable: true,
        };
        const products = yield prisma_1.default.product.findMany({
            where: whereClause,
            skip: (page - 1) * take,
            take: take,
            orderBy: {
                [sortBy]: sortOrder,
            },
            include: {
                discount: true,
            },
        });
        const count = yield prisma_1.default.product.count({ where: whereClause });
        return {
            data: products,
            meta: { page, take, total: count },
        };
    }
    catch (error) {
        throw error;
    }
});
exports.getProductsService = getProductsService;
