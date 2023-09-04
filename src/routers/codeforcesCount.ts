import express, { Request, Response } from "express";
import puppeteer from "puppeteer";
import responseHandler from "../handlers/response.handler";

const codeforcesCount = express.Router();

codeforcesCount.get(
    "/count/total/:username",
    async (req: Request, res: Response) => {
        try {
            const { username } = req.params;
            const URL: string = `https://codeforces.com/profile/${username}`;
            const xPath: string =
                '//*[@id="pageContent"]/div[4]/div/div[3]/div[1]/div[1]/div[1]';

            // Launch Puppeteer browser and go to the URL
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(URL);

            // Handle invalid username cases
            if (page.url() !== URL) {
                console.log("Invalid username");
                throw new Error();
            }

            await page.waitForXPath(xPath);
            const [el] = await page.$x(xPath);

            // Get the text content of the element
            const txtHandle = await el.getProperty("textContent");
            const rawTxt: string = await txtHandle.jsonValue();

            // Convert the text like "1800 problems" or "1 problem" to number 1800 or 1
            const totalSolved: number = parseInt(
                rawTxt.replace(" problems" || " problem", ""),
                10
            );
            await browser.close();

            responseHandler.success(res, "", { username, totalSolved });
        } catch (error) {
            console.error(error);
            responseHandler.error(res);
        }
    }
);

export default codeforcesCount;
