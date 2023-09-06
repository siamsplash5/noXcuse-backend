import axios from "axios";
import express, { Request, Response } from "express";
import responseHandler from "../handlers/response.handler";
import { SolveCount } from "types/User";

const totalCount = express.Router();

function sleep(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

const judgeList = [
    "atcoder",
    "beecrowd",
    "codechef",
    "codeforces",
    "cses",
    "leetcode",
    "lightoj",
    "spoj",
    "timus",
    "toph",
    "uva",
];

totalCount.get("/:username", async (req: Request, res: Response) => {
    try {
        const solveStats: SolveCount = {};
        const onlineJudgeHandles: string[] = [];

       

        let totalSolve: number = 0;

        // Use Promise.all to await all async requests
        const requests = onlineJudgeHandles.map(
            async (handle: string, index: number) => {
                if (handle.length) {
                    const url: string = `http://localhost:8080/api/${judgeList[index]}/count/total/${handle}`;
                    console.log(url);
                    const { data: response } = await axios.get(url);
                    solveStats[judgeList[index] as keyof SolveCount] =
                        response.data.totalSolved;
                    totalSolve += response.data.totalSolved;
                }
            }
        );

    
        await Promise.all(requests);

        responseHandler.success(res, "", { totalSolve, solveStats });
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default totalCount;
