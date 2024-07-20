import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const updateProductValidator = [
  body("name").optional().isLength({ min: 3 }).withMessage("name is too short"),
  body("description").optional(),
  body("price").optional().isInt().withMessage("price must be a number"),
  body("stock").optional().isInt().withMessage("stock must be a number"),
  body("color").optional().isString().withMessage("color must be a string"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];
