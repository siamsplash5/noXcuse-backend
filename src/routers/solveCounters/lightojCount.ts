import express, { Request, Response } from "express";
import puppeteer from "puppeteer";
import responseHandler from "../../handlers/response.handler";

const lightojCount = express.Router();

lightojCount.get(
    "/count/total/:username",
    async (req: Request, res: Response) => {
        try {
            const { username } = req.params;
            const URL: string = `https://lightoj.com/user/${username}`;
            const xPath: string =
                '//*[@id="pages-community"]/div[2]/div[2]/div/div[2]/div[1]/div[1]/span[1]';

            // Launch Puppeteer browser and go to the URL
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(URL);
            const pageTitle: string = await page.title();

            // Handle invalid username cases
            if (pageTitle === "500 | LightOJ") {
                console.log("Invalid username");
                throw new Error();
            }

            await page.waitForXPath(xPath, { timeout: 5000 });
            const [el] = await page.$x(xPath);

            // Get the text content of the element and convert to number
            const txtHandle = await el.getProperty("textContent");
            const rawTxt: string = await txtHandle.jsonValue();
            const totalSolved: number = parseInt(rawTxt, 10);
            await browser.close();

            responseHandler.success(res, "", { username, totalSolved });
        } catch (error) {
            console.error(error);
            responseHandler.error(res);
        }
    }
);

export default lightojCount;
