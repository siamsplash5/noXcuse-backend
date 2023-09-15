import { body, validationResult } from "express-validator";
import responseHandler from "../../handlers/response.handler";
import { Request, Response, NextFunction } from "express";

export const loginValidator = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username can't be empty")
        .matches(/^[a-zA-Z0-9._-]+$/)
        .withMessage("Invalid username/password"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password can't be empty")
        .isLength({ min: 8 })
        .withMessage("Invalid username/password"),
];

export function runLoginValidation(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const errors = validationResult(req);
        if (errors.isEmpty() === false) {
            const errorMessage = errors.array()[0].msg;
            return responseHandler.badRequest(res, errorMessage);
        }
        next();
    } catch (error) {
        responseHandler.error(res);
    }
}
