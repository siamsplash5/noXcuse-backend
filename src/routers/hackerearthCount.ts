import express, { Request, Response } from "express";
import puppeteer from "puppeteer";
import responseHandler from "../handlers/response.handler";

const hackerearthCount = express.Router();

hackerearthCount.get(
    "/count/total/:username",
    async (req: Request, res: Response) => {
        try {
            const { username } = req.params;
            const URL: string = `https://www.hackerearth.com/${username}`;
            const xPath: string =
                '//*[@id="__next"]/div[3]/div/div/div[3]/div/div[3]/div[3]/div[2]/div[2]';

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

            responseHandler.success(res, "", { username, rawTxt });
        } catch (error) {
            console.error(error);
            responseHandler.error(res);
        }
    }
);

export default hackerearthCount;
