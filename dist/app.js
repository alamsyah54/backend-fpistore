"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const config_1 = require("./config");
const auth_router_1 = require("./routers/auth.router");
const user_router_1 = require("./routers/user.router");
const product_router_1 = require("./routers/product.router");
const cors_1 = __importDefault(require("cors"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configure();
        this.routes();
        this.handleError();
    }
    configure() {
        this.app.use((0, cors_1.default)());
        this.app.use((0, express_1.json)());
        this.app.use((0, express_1.urlencoded)({ extended: true }));
    }
    handleError() {
        // not found
        this.app.use((req, res, next) => {
            if (req.path.includes("/api/")) {
                res.status(404).send("Not found !");
            }
            else {
                next();
            }
        });
        // error
        this.app.use((err, req, res, next) => {
            var _a;
            if (req.path.includes("/api/")) {
                console.error("Error : ", err.stack);
                res
                    .status(500)
                    .send((_a = err.stack) === null || _a === void 0 ? void 0 : _a.split("\n")[0].replace("Error: ", ""));
            }
            else {
                next();
            }
        });
    }
    routes() {
        const authRouter = new auth_router_1.AuthRouter();
        const userRouter = new user_router_1.UserRouter();
        const productRouter = new product_router_1.ProductRouter();
        this.app.get("/api", (req, res) => {
            res.send(`Welcome to fpistore.net API !`);
        });
        this.app.use("/api/auth", authRouter.getRouter());
        this.app.use("/api/user", userRouter.getRouter());
        this.app.use("/api/product", productRouter.getRouter());
    }
    start() {
        this.app.listen(config_1.PORT, () => {
            console.log(`Server running on port : ${config_1.PORT}`);
        });
    }
}
exports.default = App;
