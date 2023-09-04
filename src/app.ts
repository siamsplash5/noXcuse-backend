import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";
import mongoose from "mongoose";

import atcoderCount from "./routers/atcoderCount";
import beecrowdCount from "./routers/beecrowdCount";
import codechefCount from "./routers/codechefCount";
import codeforcesCount from "./routers/codeforcesCount";
import leetcodeCount from "./routers/leetcodeCount";

const app = express();
const PORT: string = process.env.PORT;
const MONGO_URL: string = process.env.MONGODB_CONNECTION_STRING;

app.use(
    cors({
        credentials: true,
    })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => {
    console.log(error);
});

app.use("/atcoder", atcoderCount);
app.use("/beecrowd", beecrowdCount);
app.use("/codechef", codechefCount);
app.use("/codeforces", codeforcesCount);
app.use("/leetcode", leetcodeCount);
