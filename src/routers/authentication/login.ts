import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
    loginValidator,
    runLoginValidation,
} from "../../middleware/validators/login";

import responseHandler from "../../handlers/response.handler";
import { isUserExist } from "../../models/userModel";
import { UserExistResponse } from "types/UserExistResponseType";

const loginRouter = express.Router();
const maxAge = 60 * 60 * 1000; // 1 hours
const errorMessage = "Invalid username/password";

async function handleLogin(req: Request, res: Response) {
    try {
        const { username, password } = req.body;

        // Check if the account exists
        const user: UserExistResponse = await isUserExist(
            username, // checking parameter
            { byUsername: true }, // tell the function that passed parameter is username
            { mongoDBId: true, password: true } // return those data after checking
        );

        if (user === null) {
            // user not found on database
            return responseHandler.badRequest(res, errorMessage);
        }

        const { _id, password: hashedPassword } = user;

        // check the password is valid or not
        const isMatched = await bcrypt.compare(password, hashedPassword);
        if (isMatched === false) {
            return responseHandler.badRequest(res, errorMessage);
        }

        // Genereate authentication token
        const token = jwt.sign(
            { id: _id, user: username },
            process.env.JWT_SECRET,
            {
                expiresIn: maxAge,
            }
        );

        //send the token to client end
        responseHandler.success(res, `Welcome ${username}`, { token });
    } catch (error) {
        responseHandler.error(res);
    }
}

loginRouter.post("/", loginValidator, runLoginValidation, handleLogin);

export default loginRouter;
