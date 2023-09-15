import express, { Request, Response } from "express";
import responseHandler from "../../handlers/response.handler";
import { createNewUser } from "../../models/userModel";

const testRouter = express.Router();

testRouter.get("/", async (req: Request, res: Response) => {
    try {
        const user = req.body;
        const newUser = await createNewUser(user);
        responseHandler.success(res, "route working", newUser);
    } catch (error) {
        responseHandler.error(res, error.message);
    }
});

export default testRouter;
