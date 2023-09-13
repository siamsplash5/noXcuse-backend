import axios from "axios";
import express, { Request, Response } from "express";
import responseHandler from "../../handlers/response.handler";

const uvaCount = express.Router();

/* 
    Return the total solve count of uva online judge of a user
    API Route: "api/uva/count/total"
*/

uvaCount.get("/count/total/:username", async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        // Convert username to user ID
        const converterAPI: string = `https://uhunt.onlinejudge.org/api/uname2uid/${username}`;
        const { data: userId }: { data: number } =
            await axios.get(converterAPI);

        // Handle invalid username case
        // For invalid username, the API will return 0
        if (userId === 0) {
            console.log("Invalid username");
            throw new Error();
        }

        // Calling uhunt API to get all submission data by userId
        const API_URL: string = `https://uhunt.onlinejudge.org/api/subs-user/${userId}`;
        const { data: submissions } = await axios.get(API_URL);
        const { subs }: { subs: number[][] } = submissions;

        /* 
            The subs array length is the same as the number of submissions of the user.
            Each element is one submission with values:

                0: Submission ID
                1: Problem ID
                2: Verdict ID
                3: Runtime
                4: Submission Time (unix timestamp)
                5: Language ID (1=ANSI C, 2=Java, 3=C++, 4=Pascal, 5=C++11)
                7: Submission Rank

            Verdict ID can be one of the following values:

                10 : Submission error
                15 : Can't be judged
                20 : In queue
                30 : Compile error
                35 : Restricted function
                40 : Runtime error
                45 : Output limit
                50 : Time limit
                60 : Memory limit
                70 : Wrong answer
                80 : PresentationE
                90 : Accepted

            Each problem can get accepted multiple times.
            So, counting number accepted (90) is not a good approach.
            Instead, we can store the problem ID of solved problems.
            Problem ID can repeat, so we will use Set to store the unique ones.
        */
        const acceptedProblemID: Set<number> = new Set();

        // Iterate the subs, add the problemId in Set whose verdict = 90
        subs.forEach((submission: number[]) => {
            const problemId = submission[1];
            const verdictId = submission[2];
            if (verdictId === 90) {
                acceptedProblemID.add(problemId);
            }
        });

        // Finally, the set size will be our desired solve count
        const totalSolved: number = acceptedProblemID.size;

        responseHandler.success(res, "", { username, totalSolved });
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default uvaCount;
