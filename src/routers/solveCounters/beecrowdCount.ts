import express, { Request, Response } from "express";
import puppeteer from "puppeteer-extra";
import pluginStealth from "puppeteer-extra-plugin-stealth";
import responseHandler from "../../handlers/response.handler";
puppeteer.use(pluginStealth());

const codechefCount = express.Router();

codechefCount.get(
    "/count/total/:userId",
    async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const URL: string = `https://www.beecrowd.com.br/judge/en/profile/${userId}`;
            const xPath: string = `//*[@id="profile-bar"]/ul/li[6]`;

            // Launch Puppeteer browser and go to the URL
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(URL);

            // Handle invalid username cases
            const pageTitle = await page.title();
            if (pageTitle === "Error") {
                console.log("Invalid user ID");
                throw new Error();
            }

            // Get the text content of the element from xPath
            await page.waitForXPath(xPath);
            const [el] = await page.$x(xPath);

            // get the raw text from xPath
            const txtHandle = await el.getProperty("textContent");
            const rawTxt: string = await txtHandle.jsonValue();

            // close the browser for free up memory
            await browser.close();

            // extract total solve count from string
            const totalSolved: number = parseInt(
                rawTxt.replace("\nSolved:\n", ""),
                10
            );

            responseHandler.success(res, "", { userId, totalSolved });
        } catch (error) {
            console.error(error);
            responseHandler.error(res);
        }
    }
);

export default codechefCount;
