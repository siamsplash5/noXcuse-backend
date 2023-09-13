import axios from "axios";
import { load } from "cheerio";
import express, { Request, Response } from "express";
import responseHandler from "../../handlers/response.handler";

const timusCount = express.Router();

timusCount.get("/count/total/:userId", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const profileURL: string = `https://acm.timus.ru/author.aspx?id=${userId}`;

        const { data: html } = await axios.get(profileURL);
        const $ = load(html);
        const rawTxt = $("td.author_stats_value").eq(1).text();

        // Convert the text like "506 out of 2495" into number 506
        const regex = /(\d+)\s+out\s+of\s+(\d+)/;
        const match = rawTxt.match(regex);
        const totalSolved = parseInt(match[1], 10);

        responseHandler.success(res, "", { userId, totalSolved });
    } catch (error) {
        console.error(error);
        responseHandler.error(res);
    }
});

export default timusCount;
