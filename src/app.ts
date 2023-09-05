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
import csesCount from "./routers/csesCount";
import hackerearthCount from "./routers/hackerearthCount";
import leetcodeCount from "./routers/leetcodeCount";
import lightojCount from "./routers/lightojCount";
import spojCount from "./routers/spojCount";
import timusCount from "./routers/timusCount";
import tophCount from "./routers/tophCount";
import uvaCount from "./routers/uvaCount";

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

app.use("/api/atcoder", atcoderCount);
app.use("/api/beecrowd", beecrowdCount);
app.use("/api/codechef", codechefCount);
app.use("/api/codeforces", codeforcesCount);
app.use("/api/cses", csesCount);
app.use("/api/hackerearth", hackerearthCount);
app.use("/api/lightoj", lightojCount);
app.use("/api/leetcode", leetcodeCount);
app.use("/api/spoj", spojCount);
app.use("/api/timus", timusCount);
app.use("/api/toph", tophCount);
app.use("/api/uva", uvaCount);
