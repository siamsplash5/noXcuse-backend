import { Response } from "express";

// send response to user
const responseWithData = (
    res: Response,
    data: {
        status: number;
        message: string;
        data?: unknown;
    }
): Response => res.send(data);

// after succesful operation
const success = (res: Response, message: string = "success", data?: unknown): void => {
    const responseObj: { status: number; message: string; data?: unknown } = {
        status: 200,
        message,
        data,
    };
    responseWithData(res, responseObj);
};

// after create a new instance
const created = (res: Response, message: string = "created", data?: unknown): void => {
    const responseObj: { status: number; message: string; data?: unknown } = {
        status: 201,
        message,
        data,
    };
    responseWithData(res, responseObj);
};

// after doing a process, user's action required
const pending = (res: Response, message: string = "pending", data?: unknown): void => {
    const responseObj: { status: number; message: string; data?: unknown } = {
        status: 202,
        message,
        data,
    };
    responseWithData(res, responseObj);
};

// handling error cases
const error = (
    res: Response,
    message: string = "Opps! Something went wrong!",
    data?: unknown
): void => {
    const responseObj: { status: number; message: string; data?: unknown } = {
        status: 500,
        message,
        data,
    };
    responseWithData(res, responseObj);
};

// handling bad request
const badRequest = (res: Response, message: string = "bad request", data?: unknown): void => {
    const responseObj: { status: number; message: string; data?: unknown } = {
        status: 400,
        message,
        data,
    };
    responseWithData(res, responseObj);
};

// handling unauthorized request
const unauthorize = (res: Response, message: string = "unauthorized", data?: unknown): void => {
    const responseObj: { status: number; message: string; data?: unknown } = {
        status: 401,
        message,
        data,
    };
    responseWithData(res, responseObj);
};

//handling forbidden routes accessing
const forbidden = (res: Response, message: string = "forbidden", data?: unknown): void => {
    const responseObj: { status: number; message: string; data?: unknown } = {
        status: 403,
        message,
        data,
    };
    responseWithData(res, responseObj);
};

// handling not found request
const notfound = (res: Response, message: string = "not found", data?: unknown): void => {
    const responseObj: { status: number; message: string; data?: unknown } = {
        status: 404,
        message,
        data,
    };
    responseWithData(res, responseObj);
};

export default {
    badRequest,
    created,
    error,
    forbidden,
    notfound,
    pending,
    success,
    unauthorize,
};
