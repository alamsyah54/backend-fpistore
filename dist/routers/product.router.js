"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRouter = void 0;
const express_1 = require("express");
const verifyToken_1 = require("../middlewares/verifyToken");
const product_controller_1 = require("../controllers/product.controller");
const uploader_1 = require("../libs/uploader");
const createProductValidator_1 = require("../middlewares/validator/createProductValidator");
const updateProductValidator_1 = require("../middlewares/validator/updateProductValidator");
class ProductRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.productController = new product_controller_1.ProductController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/", verifyToken_1.verifyToken, (0, uploader_1.uploader)("IMG", "/images").array("image", 1), createProductValidator_1.createProductValidator, this.productController.createProductController);
        this.router.get("/", this.productController.getProductsController);
        this.router.get("/:id", this.productController.getProductController);
        this.router.patch("/:id", verifyToken_1.verifyToken, (0, uploader_1.uploader)("IMG", "/images").array("image", 1), updateProductValidator_1.updateProductValidator, this.productController.updateProductController);
        this.router.delete("/:id", this.productController.deleteProductController);
    }
    getRouter() {
        return this.router;
    }
}
exports.ProductRouter = ProductRouter;
