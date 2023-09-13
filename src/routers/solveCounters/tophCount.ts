import axios from "axios";
import { load } from "cheerio";
import express, { Request, Response } from "express";
import responseHandler from "../../handlers/response.handler";

const tophCount = express.Router();

tophCount.get("/count/total/:username", async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        const profileURL: string = `https://toph.co/u/${username}`;

        // Go to user's profile and grab the HTML
        const { data: html } = await axios.get(profileURL);
        // Load the HTML in cheerio
        const $ = load(html);

        // Extract the total solve count and convert it to number
        const totalSolvedTxt: string = $("div.numbers div.value").eq(1).text();
        const totalSolved: number = parseInt(totalSolvedTxt, 10);

        responseHandler.success(res, "", { username, totalSolved });
    } catch (error) {
        console.error(error);
        responseHandler.error(res);
    }
});

export default tophCount;
