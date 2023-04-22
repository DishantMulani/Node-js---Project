import { Request, Response } from "express";
import mongoose from "mongoose";
import { ThrowError } from "./ErrorUtil";
import UserCollection from "../schemas/UserSchema";


export const getUser = async (req: Request, res: Response) => {
    try {
        const userId: any = req.headers["user"];
        if (!userId) {
            return res.status(401).json({
                msg: 'Invalid User Request'
            });
        }
        const mongoUserId = new mongoose.Types.ObjectId(userId);
        let userObj: any = await UserCollection.findById(mongoUserId);
        if (!userObj) {
            return ThrowError(res, 404, "User is not found");
        }
        return userObj;
    } catch (error) {
        return ThrowError(res);
    }
}
