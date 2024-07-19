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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const create_product_service_1 = require("../services/product/create-product.service");
const get_products_service_1 = require("../services/product/get-products.service");
const get_product_service_1 = require("../services/product/get-product.service");
const update_product_service_1 = require("../services/product/update-product.service");
const delete_product_service_1 = require("../services/product/delete-product.service");
class ProductController {
    createProductController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = req.files;
                if (!(files === null || files === void 0 ? void 0 : files.length)) {
                    throw new Error("no image uploaded");
                }
                const result = yield (0, create_product_service_1.createProductService)(req.body, files[0]);
                res.status(200).send(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getProductsController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = {
                    take: parseInt(req.query.take) || 8,
                    page: parseInt(req.query.page) || 1,
                    sortBy: parseInt(req.query.sortBy) || "name",
                    sortOrder: parseInt(req.query.sortOrder) || "desc",
                    search: req.query.search,
                };
                const result = yield (0, get_products_service_1.getProductsService)(query);
                return res.status(200).send(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getProductController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const result = yield (0, get_product_service_1.getProductService)(Number(id));
                return res.status(200).send(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateProductController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const files = req.files;
                const userId = res.locals.user.id;
                const result = yield (0, update_product_service_1.updateProductService)(Number(id), req.body, Number(userId), files[0]);
                return res.status(200).send(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteProductController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const userId = res.locals.user.id;
                const result = yield (0, delete_product_service_1.deleteProductService)(Number(id), Number(userId));
                return res.status(200).send(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ProductController = ProductController;
