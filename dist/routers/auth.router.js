"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
class AuthRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.authController = new auth_controller_1.AuthController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/sign-up", this.authController.signUpController);
        this.router.post("/sign-in", this.authController.signInController);
        this.router.get("/keep-login", verifyToken_1.verifyToken, this.authController.keepLoginController);
        this.router.post("/refresh", this.authController.refreshTokenController);
    }
    getRouter() {
        return this.router;
    }
}
exports.AuthRouter = AuthRouter;
