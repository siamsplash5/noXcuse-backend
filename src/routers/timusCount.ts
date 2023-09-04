import express, { Request, Response } from "express";
import puppeteer from "puppeteer";
import responseHandler from "../handlers/response.handler";

const timusCount = express.Router();

timusCount.get("/count/total/:userId", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const URL: string = `https://acm.timus.ru/author.aspx?id=${userId}`;
        const xPath: string = `/html/body/table/tbody/tr[3]/td/table/tbody/tr/td/table[1]/tbody/tr[2]/td[2]`;

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
