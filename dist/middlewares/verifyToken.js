"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../utils/config");
const secretKey = config_1.appConfig.secret;
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({
            msg: "Authorization header is missing",
        });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).send({
            msg: "Token is missing",
        });
    }
    (0, jsonwebtoken_1.verify)(token, secretKey, (err, payload) => {
        if (err) {
            if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                return res.status(401).send({ msg: "Token expired", token });
            }
            else {
                return res
                    .status(401)
                    .send({ msg: "Invalid token", error: err.message, token });
            }
        }
        res.locals.user = payload;
        next();
    });
};
exports.verifyToken = verifyToken;
