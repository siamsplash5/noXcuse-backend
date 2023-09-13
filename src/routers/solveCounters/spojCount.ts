import axios from "axios";
import { load } from "cheerio";
import express, { Request, Response } from "express";
import responseHandler from "../../handlers/response.handler";

const spojCount = express.Router();

spojCount.get("/count/total/:username", async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        const profileURL: string = `https://www.spoj.com/users/${username}/`;
        const { data: html } = await axios.get(profileURL);
        const $ = load(html);
        const totalSolvedTxt: string = $('dt:contains("Problems solved")')
            .next("dd")
            .text();
        const totalSolved: number = parseInt(totalSolvedTxt, 10);
        responseHandler.success(res, "", { username, totalSolved });
    } catch (error) {
        console.error(error);
        responseHandler.error(res);
    }
});

export default spojCount;
