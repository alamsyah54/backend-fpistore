"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const verifyToken_1 = require("../middlewares/verifyToken");
const user_controller_1 = require("../controllers/user.controller");
class UserRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.userController = new user_controller_1.UserController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/:id", verifyToken_1.verifyToken, this.userController.getUserController);
    }
    getRouter() {
        return this.router;
    }
}
exports.UserRouter = UserRouter;
