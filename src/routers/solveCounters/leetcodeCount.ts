import axios from "axios";
import express, { Request, Response } from "express";
import responseHandler from "../../handlers/response.handler";

const leetcodeCount = express.Router();

leetcodeCount.get(
    "/count/total/:username",
    async (req: Request, res: Response) => {
        try {
            const { username } = req.params;
            const API_URL: string = `https://leetcode-stats-api.herokuapp.com/${username}`;
            const { data } = await axios.get(API_URL);
            const { totalSolved }: { totalSolved: number } = data;
            responseHandler.success(res, "", { username, totalSolved });
        } catch (error) {
            console.log(error);
            responseHandler.error(res);
        }
    }
);

export default leetcodeCount;
