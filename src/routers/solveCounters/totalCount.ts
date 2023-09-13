import axios from "axios";
import express, { Request, Response } from "express";
import responseHandler from "../../handlers/response.handler";
import { getUserByUsername } from "../../models/userModel";
import { UserDB } from "../../types/User";

const totalCount = express.Router();

const domain: string = "http://localhost:8080/api";

const apiList = [
    `${domain}/atcoder/count/total`,
    `${domain}/beecrowd/count/total`,
    `${domain}/codechef/count/total`,
    `${domain}/codeforces/count/total`,
    `${domain}/cses/count/total`,
    `${domain}/leetcode/count/total`,
    `${domain}/lightoj/count/total`,
    `${domain}/spoj/count/total`,
    `${domain}/timus/count/total`,
    `${domain}/toph/count/total`,
    `${domain}/uva/count/total`,
];

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

// api route: /api/solve/total/:username

totalCount.get("/:username", async (req: Request, res: Response) => {
    try {
        const { username } = req.params;

        //get the user handle for all online judges
        const user: UserDB = await getUserByUsername(username);

        const handleList: string[] = [
            user.atcoderHandle,
            user.beecrowdHandle,
            user.codechefHandle,
            user.codeforcesHandle,
            user.csesHandle,
            user.leetcodeHandle,
            user.lightojHandle,
            user.spojHandle,
            user.timusHandle,
            user.tophHandle,
            user.uvaHandle,
        ];

        const solveStats: {
            [key: string]: number | undefined;
        } = {};

        let totalSolve = 0;

        const requests = apiList.map(async (apiUrl: string, index: number) => {
            const handle: string = handleList[index];
            if (handle.length) {
                const { data: response } = await axios.get(
                    `${apiUrl}/${handle}`
                );
                solveStats[judgeList[index]] = response.data.totalSolved;
                totalSolve += response.data.totalSolved;
            }
        });

        await Promise.all(requests);

        responseHandler.success(res, "", { totalSolve, solveStats });
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default totalCount;
