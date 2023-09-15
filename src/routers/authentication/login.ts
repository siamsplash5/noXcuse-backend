import express, { Request, Response } from "express";
const login = express.Router();

// api route: "api/login/"

login.post("/", (req: Request, res: Response) => {
    try {
        res.send("login success");
    } catch (error) {
        res.send("there is a error");
    }
});

export default login;
