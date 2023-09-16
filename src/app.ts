import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";
import mongoose from "mongoose";

import atcoderCount from "./routers/solveCounters/atcoderCount";
import beecrowdCount from "./routers/solveCounters/beecrowdCount";
import codechefCount from "./routers/solveCounters/codechefCount";
import codeforcesCount from "./routers/solveCounters/codeforcesCount";
import csesCount from "./routers/solveCounters/csesCount";
import leetcodeCount from "./routers/solveCounters/leetcodeCount";
import lightojCount from "./routers/solveCounters/lightojCount";
import spojCount from "./routers/solveCounters/spojCount";
import timusCount from "./routers/solveCounters/timusCount";
import tophCount from "./routers/solveCounters/tophCount";
import totalCount from "./routers/solveCounters/totalCount";
import uvaCount from "./routers/solveCounters/uvaCount";

import loginRouter from "./routers/authentication/login";
import registerRouter from "./routers/authentication/registration";

import testRouter from "./routers/test/testRouter";

const app = express();
const PORT: string = process.env.PORT;
const MONGO_URL: string = process.env.MONGODB_CONNECTION_STRING;

app.use(
    cors({
        origin: "http://localhost:5173",
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

app.use("/api/atcoder", atcoderCount);
app.use("/api/beecrowd", beecrowdCount);
app.use("/api/codechef", codechefCount);
app.use("/api/codeforces", codeforcesCount);
app.use("/api/cses", csesCount);
app.use("/api/lightoj", lightojCount);
app.use("/api/leetcode", leetcodeCount);
app.use("/api/spoj", spojCount);
app.use("/api/timus", timusCount);
app.use("/api/toph", tophCount);
app.use("/api/uva", uvaCount);
app.use("/api/solve/total", totalCount);

app.use("/api/login", loginRouter);
app.use("/api/register", registerRouter);

app.use("/api/test", testRouter);
