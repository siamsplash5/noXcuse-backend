import axios from "axios";
import { load } from "cheerio";
import express, { Request, Response } from "express";
import responseHandler from "../../handlers/response.handler";

const codechefCount = express.Router();

codechefCount.get(
    "/count/total/:username",
    async (req: Request, res: Response) => {
        try {
            const { username } = req.params;
            const profileURL: string = `https://www.codechef.com/users/${username}`;

            const { data: html } = await axios.get(profileURL);
            const $ = load(html);
            const rawTxt = $('h5:contains("Fully Solved")').eq(0).text();

            const match = rawTxt.match(/\((\d+)\)/);
            const totalSolved: number = parseInt(match[1], 10);

            responseHandler.success(res, "", { username, totalSolved });
        } catch (error) {
            console.error(error);
            responseHandler.error(res);
        }
    }
);

export default codechefCount;
