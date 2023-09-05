import axios from "axios";
import { load } from "cheerio";
import express, { Request, Response } from "express";
import responseHandler from "../handlers/response.handler";

const codeforcesCount = express.Router();

codeforcesCount.get(
    "/count/total/:username",
    async (req: Request, res: Response) => {
        try {
            const { username } = req.params;
            const profileURL: string = `https://codeforces.com/profile/${username}`;
            const { data: html } = await axios.get(profileURL);
            const $ = load(html);
            const totalSolveTxt: string = $(
                "div._UserActivityFrame_counterValue"
            )
                .eq(0)
                .text();
            const totalSolved: number = parseInt(
                totalSolveTxt.replace(" problems" || " problem", ""),
                10
            );
            responseHandler.success(res, "", { username, totalSolved });
        } catch (error) {
            console.error(error);
            responseHandler.error(res);
        }
    }
);

export default codeforcesCount;
