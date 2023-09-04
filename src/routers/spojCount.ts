import express, { Request, Response } from "express";
import puppeteer from "puppeteer";
import responseHandler from "../handlers/response.handler";

const spojCount = express.Router();

spojCount.get("/count/total/:username", async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        const URL: string = `https://www.spoj.com/users/${username}/`;
        const xPath: string = `//*[@id="content"]/div[2]/div/div[2]/div[1]/div/div[2]/div[1]/dl/dd[1]`;

        // Launch Puppeteer browser and go to the URL
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(URL);

        // Handle invalid username cases
        if (page.url() !== URL) {
            console.log("Invalid username");
            throw new Error();
        }

        await page.waitForXPath(xPath, { timeout: 10000 });
        const [el] = await page.$x(xPath);

        // Get the text content of the element
        const txtHandle = await el.getProperty("textContent");
        const rawTxt: string = await txtHandle.jsonValue();

        await browser.close();

        // Convert the text into number
        const totalSolved: number = parseInt(rawTxt, 10);
        
        responseHandler.success(res, "", { username, totalSolved });
    } catch (error) {
        console.error(error);
        responseHandler.error(res);
    }
});

export default spojCount;
