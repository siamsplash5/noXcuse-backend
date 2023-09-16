import { NextFunction, Request, Response } from "express";
import {
    body,
    Result,
    ValidationError,
    validationResult,
} from "express-validator";
import responseHandler from "../../handlers/response.handler";

export const otpValidator = [
    body("otp")
        .trim()
        .notEmpty()
        .withMessage("OTP can't be empty")
        .matches(/^\d{6}$/)
        .withMessage("Invalid OTP"),
];

export function runOtpValidation(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            return responseHandler.badRequest(res, errors.array()[0].msg);
        }
        next();
    } catch (error) {
        responseHandler.error(res);
    }
}
