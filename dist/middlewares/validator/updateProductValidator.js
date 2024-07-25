"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductValidator = void 0;
const express_validator_1 = require("express-validator");
exports.updateProductValidator = [
    (0, express_validator_1.body)("name").optional().isLength({ min: 3 }).withMessage("name is too short"),
    (0, express_validator_1.body)("description").optional(),
    (0, express_validator_1.body)("price").optional().isInt().withMessage("price must be a number"),
    (0, express_validator_1.body)("stock").optional().isInt().withMessage("stock must be a number"),
    (0, express_validator_1.body)("color").optional().isString().withMessage("color must be a string"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).send({ errors: errors.array() });
        }
        next();
    },
];
