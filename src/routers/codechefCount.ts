import express, { Request, Response } from "express";
import puppeteer from "puppeteer";
import responseHandler from "../handlers/response.handler";

const codechefCount = express.Router();

codechefCount.get(
    "/count/total/:username",
    async (req: Request, res: Response) => {
        try {
            const { username } = req.params;
            const URL: string = `https://www.codechef.com/users/${username}`;
            const xPath: string =
                "/html/body/main/div/div/div/div/div/section[6]/div/h5[1]";

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

            await browser.close();

            // Convert the text like "Fully Solved (244)" to a number 244
            // Use a regular expression to find the number within parentheses
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
