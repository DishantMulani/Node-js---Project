import { Response } from "express";
import { APP_STATUS } from "../constant/constants";

export const ThrowError = (res: Response, statusCode?: number, msg?: string) => {
    return res.status(statusCode ? statusCode : 500).json({
        status: APP_STATUS.FAILED,
        msg: msg ? msg : "Server Error",
        data: null
    });
};