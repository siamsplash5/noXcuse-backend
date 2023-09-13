import axios from "axios";
import cheerio from "cheerio";
import express, { Request, Response } from "express";
import responseHandler from "../../handlers/response.handler";

const csesCount = express.Router();

csesCount.get("/count/total/:userId", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const profileURL: string = `https://cses.fi/user/${userId}/`;

        // Go to user's profile and grab the HTML
        const { data: html } = await axios.get(profileURL);

        // Load the HTML in cheerio
        const $ = cheerio.load(html);

        // Extract the total solve count and convert it to number
        const totalSolvedInText: string = $("td a").text();
        const totalSolved: number = parseInt(totalSolvedInText, 10);

        responseHandler.success(res, "", { userId, totalSolved });
    } catch (error) {
        console.error(error);
        responseHandler.error(res);
    }
});

export default csesCount;
