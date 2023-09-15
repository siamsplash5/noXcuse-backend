// CustomAuthRequest inteface for authentication purpose
import { Request } from "express";

export default interface CustomAuthRequest extends Request {
    authConfig?: {
        headers: {
            userMongoDBId: string;
            username: string;
        };
    };
}
