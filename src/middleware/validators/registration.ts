import { NextFunction, Request, Response } from "express";
import {
    body,
    Result,
    ValidationError,
    validationResult,
} from "express-validator";
import responseHandler from "../../handlers/response.handler";

export const registrationValidator = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username can't be empty")
        .matches(/^[a-z0-9._-]+$/)
        .toLowerCase()
        .withMessage(
            "Username should contain only Latin letters, digits, dot, underscore or dash characters"
        ),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email can't be empty")
        .toLowerCase()
        .isEmail()
        .withMessage("Enter valid email"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password can't be empty")
        .isLength({ min: 8 })
        .withMessage("Password must contain a minimum of 8 characters"),
];

export function runValidation(req: Request, res: Response, next: NextFunction) {
    try {
        const errors: Result<ValidationError> = validationResult(req);

        if (errors.isEmpty() === false) {
            return responseHandler.badRequest(res, errors.array()[0].msg);
        }
        next();
    } catch (error) {
        responseHandler.error(res);
    }
}
