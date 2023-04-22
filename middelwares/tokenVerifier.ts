import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
export const tokenVerifier = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // read the token from request
        let secretKey: string | undefined = process.env.JWT_SECRET_KEY;
        if (secretKey) {
            let token = req.headers["x-auth-token"];
            if (!token) {
                return res.status(401).json({
                    msg: 'No Token Provided!'
                });
            }
            if (typeof token === "string" && secretKey) {
                let decodeObj: any = await jwt.verify(token, secretKey);
                req.headers['user-data'] = decodeObj;
                next(); // passing to actual URL
            } else {
                return res.status(401).json({
                    msg: 'An Invalid Token!'
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            msg: 'Unauthorized!, its an invalid token'
        });
    }
};