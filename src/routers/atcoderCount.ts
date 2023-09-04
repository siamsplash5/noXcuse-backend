import axios from "axios";
import express, { Request, Response } from "express";
import responseHandler from "../handlers/response.handler";

// The type of object will return by Kenkoooo API
type Submission = {
    id: number;
    epoch_second: number;
    problem_id: string;
    contest_id: string;
    user_id: string;
    language: string;
    point: number;
    length: number;
    result: string;
    execution_time: number;
};

const atcoderCount = express.Router();

/* 
    Return the total solve count of atocder online judge of a user
    API Route: "atcoder/count/total"
*/

atcoderCount.get(
    "/count/total/:username",
    async (req: Request, res: Response) => {
        try {
            const { username } = req.params;
            const API_URL: string = `https://kenkoooo.com/atcoder/atcoder-api/results?user=${username}`;

            // Calling Kenkoooo API to get all submission data by username
            const { data: submissionList } = await axios.get(API_URL);

            // Each problem can get accepted multiple times
            // So, counting number of result == "AC" is not a good approach
            // Instead, we can store the problem ID of solved problems
            // Problem ID can repeat, so we will use set to store the unique ones
            const acceptedProblemID: Set<string> = new Set();

            // Iterate the submissionList, add the problemID in set whose result is AC
            submissionList.forEach((submission: Submission) => {
                const {
                    problem_id,
                    result,
                }: { problem_id: string; result: string } = submission;
                if (result === "AC") {
                    acceptedProblemID.add(problem_id);
                }
            });

            // Finally, the set size will be our desired solve count
            const totalSolved: number = acceptedProblemID.size;

            // Send response to client side
            const data: { username: string; totalSolved: number } = {
                username,
                totalSolved,
            };
            responseHandler.success(res, "", data);
        } catch (error) {
            console.log(error);
            responseHandler.error(res);
        }
    }
);

export default atcoderCount;
