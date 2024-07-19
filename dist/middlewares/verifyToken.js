"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../utils/config");
const secretKey = config_1.appConfig.secret;
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.status(401).send({
            message: "token is missing",
        });
    }
    (0, jsonwebtoken_1.verify)(token, secretKey, (err, payload) => {
        if (err) {
            if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                return res.status(401).send({ message: "token expired", token });
            }
            else {
                return res.status(401).send({ message: "invalid token" });
            }
        }
        res.locals.user = payload;
        next();
    });
};
exports.verifyToken = verifyToken;
