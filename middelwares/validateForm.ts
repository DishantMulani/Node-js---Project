import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { APP_STATUS } from "../constant/constants";

export const validateForm = async (req: Request, res: Response, next: NextFunction) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({
            msg: errors.array().map(error => error.msg).join('\n'),
            data: null,
            status: APP_STATUS.FAILED
        })
    }
    next();
}