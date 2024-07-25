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
exports.AuthController = void 0;
const sign_up_service_1 = require("../services/auth/sign-up.service");
const sign_in_service_1 = require("../services/auth/sign-in.service");
const keep_login_service_1 = require("../services/auth/keep-login.service");
const refresh_token_service_1 = require("../services/auth/refresh-token.service");
class AuthController {
    signUpController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, sign_up_service_1.signUpService)(req.body);
                res.status(200).send(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    signInController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, sign_in_service_1.signInService)(req.body);
                res.status(200).send(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    keepLoginController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = res.locals.user.id;
                console.log("reslocals", res.locals);
                const result = yield (0, keep_login_service_1.KeepLoginService)(Number(id));
                res.status(200).send(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    refreshTokenController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                const result = yield (0, refresh_token_service_1.refreshTokenService)(token);
                res.status(200).send(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AuthController = AuthController;
