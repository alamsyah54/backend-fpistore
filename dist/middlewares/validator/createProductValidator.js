"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createProductValidator = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("name is required")
        .isLength({ min: 3 })
        .withMessage("name is too short"),
    (0, express_validator_1.body)("description").notEmpty().withMessage("message is required"),
    (0, express_validator_1.body)("price")
        .notEmpty()
        .withMessage("price is required")
        .isInt()
        .withMessage("price must be a number"),
    (0, express_validator_1.body)("stock")
        .notEmpty()
        .withMessage("stock is required")
        .isInt()
        .withMessage("stock must be a number"),
    (0, express_validator_1.body)("color")
        .notEmpty()
        .withMessage("color is required")
        .isString()
        .withMessage("color must be a string"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).send({ errors: errors.array() });
        }
        next();
    },
];
