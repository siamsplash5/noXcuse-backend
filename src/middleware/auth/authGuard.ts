import { NextFunction, Response } from "express";
import CustomAuthRequest from "interfaces/CustomAuthRequest";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { isBlackListed } from "models/blacklistedToken";
import { AuthTokenType } from "types/AuthTokenType";
import responseHandler from "../../handlers/response.handler";
import { isUserExist } from "../../models/userModel";

// Middleware to check if the JSON Web Token is valid and authenticated
const authGuard = async (
    req: CustomAuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        let authToken: string = req.headers["authorization"];

        //check if the token not on request
        if (!authToken) {
            return responseHandler.unauthorize(res);
        }

        //check if the token starts with "Bearer"
        if (authToken.startsWith("Bearer ")) {
            //remove the Bearer part from the authToken
            authToken = authToken.slice(7);
        } else {
            return responseHandler.unauthorize(res);
        }

        // Check if the authToken has logged out before
        if (await isBlackListed(authToken)) {
            // The token is blacklisted
            return responseHandler.unauthorize(res);
        }

        // Verify the token and extract the user information
        let userMongoDBId: string;
        let decryptedUsername: string;

        try {
            const decryptedAuthToken = jwt.verify(
                authToken,
                process.env.JWT_SECRET
            ) as AuthTokenType;

            // get the user mongodb database object ID and username
            userMongoDBId = decryptedAuthToken.userMongoDBId;
            decryptedUsername = decryptedAuthToken.username;
        } catch (error) {
            // Handle token-related errors
            if (error instanceof JsonWebTokenError) {
                // Token is invalid or expired
                return responseHandler.unauthorize(res);
            } else {
                // Handle other errors if needed
                return responseHandler.error(res);
            }
        }

        // Check if the token's user ID exists in the database
        let usernameFromDB: string;

        try {
            // the function will return the username
            usernameFromDB = await isUserExist(userMongoDBId);
            if (usernameFromDB === null) {
                //user doesn't exist
                return responseHandler.unauthorize(res);
            }
        } catch (error) {
            // Handle other errors if needed
            return responseHandler.error(res);
        }

        // Check if the token's username is valid
        if (usernameFromDB !== decryptedUsername) {
            return responseHandler.unauthorize(res);
        }

        // Create a config object
        const config = {
            headers: {
                userMongoDBId,
                username: decryptedUsername,
            },
        };

        // glue the config info with request object
        req.authConfig = config;

        // Call the next middleware
        next();
    } catch (error) {
        // handing unexpected errors
        responseHandler.error(res);
    }
};

export default authGuard;
