import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
import responseHandler from "../../handlers/response.handler";
import generateRandom6DigitNumber from "../../libs/generateRandom6DigitNumber";
import { sendRegistrationVerifyMail } from "../../libs/mailService";
import {
    registrationValidator,
    runValidation,
} from "../../middleware/validators/registration";
import { getOtpByUsername, storeNewOtp } from "../../models/otpStorage";
import { isUserExist } from "../../models/userModel";
import { OtpObjectType } from "../../types/OtpObjectType";
import { UserExistResponse } from "../../types/UserExistResponseType";

async function handleRegistration(req: Request, res: Response) {
    try {
        const {
            username,
            email,
            password,
        }: { username: string; email: string; password: string } = req.body;

        // Check if the given username already in use
        const usernameFromDB: UserExistResponse = await isUserExist(
            username,
            { byUsername: true },
            { username: true } //get the username only from the response
        );

        if (usernameFromDB !== null) {
            // Username already in use
            return responseHandler.badRequest(
                res,
                "This username is already in use."
            );
        }

        // Check given email already in use
        const emailFromDB: UserExistResponse = await isUserExist(
            email,
            { byEmail: true },
            { email: true } //get the email only from the response
        );

        if (emailFromDB !== null) {
            //email already in use
            return responseHandler.badRequest(
                res,
                "This email is already in use."
            );
        }

        // check otp already has send to user before
        const otpFromDB: OtpObjectType = await getOtpByUsername(username);
        if (otpFromDB !== null) {
            // otp has already sent
            return responseHandler.badRequest(
                res,
                "OTP already has sent to your email"
            );
        }

        // Encrypt user's password
        const saltRounds: number = 10;
        const hashedPassword: string = await bcrypt.hash(password, saltRounds);

        // create a otp
        const otp: string = generateRandom6DigitNumber();

        // hash the otp for security
        const hashedOtp = await bcrypt.hash(otp, saltRounds);

        // store the otp and registration info on database for further procedure
        await storeNewOtp({
            otp: hashedOtp,
            username,
            email,
            password: hashedPassword,
        });

        // send otp to user's email
        await sendRegistrationVerifyMail(otp, username, email);

        // send response the user to guide the verification procedure
        const responseMessage: string =
            "A OTP has been sent to your email. Enter the code here to procceed.";
        responseHandler.pending(res, responseMessage, { token: username });
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
}

const registerRouter = express.Router();
registerRouter.post(
    "/",
    registrationValidator,
    runValidation,
    handleRegistration
);

export default registerRouter;
