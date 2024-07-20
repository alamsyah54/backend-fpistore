import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const createProductValidator = [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("name is too short"),
  body("description").notEmpty().withMessage("message is required"),
  body("price")
    .notEmpty()
    .withMessage("price is required")
    .isInt()
    .withMessage("price must be a number"),
  body("stock")
    .notEmpty()
    .withMessage("stock is required")
    .isInt()
    .withMessage("stock must be a number"),
  body("color")
    .notEmpty()
    .withMessage("color is required")
    .isString()
    .withMessage("color must be a string"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];
