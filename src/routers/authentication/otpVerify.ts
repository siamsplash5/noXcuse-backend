import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
import { getOtpByUsername } from "../../models/otpStorage";
import responseHandler from "../../handlers/response.handler";
import {
    otpValidator,
    runOtpValidation,
} from "../../middleware/validators/otp";
import { createNewUser } from "../../models/userModel";
import { OtpObjectType } from "../../types/OtpObjectType";
import { User } from "../../types/User";

const verificationRouter = express.Router();

const errorMessage = "Invalid OTP";

/*
    Check the otp and complete registration
*/

verificationRouter.post(
    "/registration",
    otpValidator,
    runOtpValidation,
    async (req: Request, res: Response) => {
        try {
            // get username from user's browser localstorage and the otp inputed by user
            const { username, otp } = req.body();

            // get the otp information from db
            const otpObject: OtpObjectType = await getOtpByUsername(username);

            // destructure the information from otp object found from db
            const {
                username: usernameFromDB,
                otp: otpFromDB,
                email,
                password,
                expiresAt,
            } = otpObject;

            if (expiresAt <= Date.now()) {
                // otp already expired (1 hour)
                return responseHandler.badRequest(res, errorMessage);
            }

            if (username !== usernameFromDB) {
                // invalid user requesting for otp verifcation
                return responseHandler.badRequest(res, errorMessage);
            }

            // compare the user provided otp with our otp
            const isMatched: boolean = await bcrypt.compare(otp, otpFromDB);
            if (isMatched === false) {
                // otp not matched with our otp
                return responseHandler.badRequest(res, errorMessage);
            }

            // create a new user
            const user: User = { username, email, password };
            await createNewUser(user);

            responseHandler.created(res, "user created successfully", {
                username,
            });
        } catch (error) {
            responseHandler.error(res);
        }
    }
);

/*
    Check the otp and complete password update/forgot password request
*/

verificationRouter.post(
    "/password-update",
    otpValidator,
    runOtpValidation,
    (req: Request, res: Response) => {
        try {
            responseHandler.success(res);
        } catch (error) {
            responseHandler.error(res);
        }
    }
);

export default verificationRouter;
