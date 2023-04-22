import { Request, Response } from "express"
import { IUser } from "../models/IUser"
import { APP_STATUS } from "../constant/constants";
import UserCollection from "../schemas/UserSchema";
import { validationResult } from "express-validator";
import bcryptjs from 'bcryptjs';
import gravatar from 'gravatar';
import Jwt from "jsonwebtoken";
import mongoose from "mongoose";


/**
* @usage : Get all users
* @url : http://localhost:2508/users
* @params : no-params
* @method : GET
* @access : PUBLIC
*/

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users: IUser[] | undefined = await UserCollection.find();
        if (users) {
            return res.status(200).json({
                status: APP_STATUS.SUCCESS,
                data: users,
                msg: "Successfully Get All User"
            })
        }
    }

    catch (err: any) {
        return res.status(400).json({
            status: APP_STATUS.FAILED,
            data: null,
            msg: err.message
        })
    }
}


/**
* @usage : Get single user
* @url : http://localhost:2508/users/:userId
* @params : no-params
* @method : GET
* @access : PUBLIC
*/

export const getUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const mongoId = await new mongoose.Types.ObjectId(userId);
        const user: IUser | undefined | null = await UserCollection.findById(mongoId);
        if (!user) {
            return res.status(400).json({
                status: APP_STATUS.FAILED,
                data: null,
                msg: "User Not Found"
            })
        }
        res.status(200).json({
            status: APP_STATUS.SUCCESS,
            data: user,
            msg: "Successfull"
        })
    }
    catch (err: any) {
        return res.status(400).json({
            status: APP_STATUS.FAILED,
            data: null,
            msg: err.message
        })
    }
}


/**
* @usage : Update user
* @url : http://localhost:2508/users/:userId
* @params : password
* @method : PUT
* @access : PUBLIC
*/

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { password } = req.body;
        const mongoId = await new mongoose.Types.ObjectId(userId);
        const user: IUser | undefined | null = await UserCollection.findById(mongoId);
        if (!user) {
            return res.status(400).json({
                status: APP_STATUS.FAILED,
                data: null,
                msg: "User Not Found"
            })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        const userUpdateObj: IUser = {
            name: user.name,
            email: user.email,
            password: hashPassword,
            imageUrl: user.imageUrl,
        }

        const newObj = await UserCollection.findByIdAndUpdate(mongoId, { $set: userUpdateObj }, { new: true })
        if (newObj) {
            return res.status(200).json({
                status: APP_STATUS.SUCCESS,
                data: newObj,
                msg: "Password Update Successfull"
            })
        }
    }
    catch (err: any) {
        return res.status(400).json({
            status: APP_STATUS.FAILED,
            data: null,
            msg: err.message
        })
    }
}


/**
* @usage : Delete user
* @url : http://localhost:2508/users/:userId
* @params : no-params
* @method : DELETE
* @access : PUBLIC
*/

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const mongoId = await new mongoose.Types.ObjectId(userId);
        const user: IUser | undefined | null = await UserCollection.findById(mongoId);
        if (!user) {
            return res.status(400).json({
                status: APP_STATUS.FAILED,
                data: null,
                msg: "User Not Found"
            })
        }
        const newObj: IUser | undefined | null = await UserCollection.findByIdAndDelete(mongoId);
        if (newObj) {
            return res.status(200).json({
                status: APP_STATUS.SUCCESS,
                data: {},
                msg: "User Delete Successfull"
            })
        }
    }
    catch (err: any) {
        return res.status(400).json({
            status: APP_STATUS.FAILED,
            data: null,
            msg: err.message
        })
    }
}


/**
* @usage : Create a user
* @url : http://localhost:2508/users/register
* @params : name, email, password
* @method : POST
* @access : PRIVATE
*/
export const createUser = async (req: Request, res: Response) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     res.status(400).json({ error: errors.array() });
    // }
    try {
        const { name, email, password } = req.body;

        const user: IUser | undefined | null = await UserCollection.findOne({
            email: email,
        })
        if (user) {
            return res.status(400).json({
                status: APP_STATUS.FAILED,
                data: null,
                msg: "Email Already Exist"
            })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        const imageUrl = gravatar.url(email, {
            size: "200",
            rating: 'pg',
            default: "mm"
        });

        const theNewObj: IUser = {
            name: name,
            email: email,
            password: hashPassword,
            imageUrl: imageUrl,
            isAdmin: false
        }

        const theUserObj = await new UserCollection(theNewObj).save();
        if (theUserObj) {
            return res.status(200).json({
                status: APP_STATUS.SUCCESS,
                data: theUserObj,
                msg: "User Register Successfull"
            })
        }
    }
    catch (err: any) {
        res.status(400).json({
            status: APP_STATUS.FAILED,
            data: null,
            msg: err.message
        })
    }
}


/**
* @usage : Login a user
* @url : http://localhost:2508/users/register/login
* @params : email, password
* @method : POST
* @access : PRIVATE
*/

export const loginUser = async (req: Request, res: Response) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     res.status(400).json({ error: errors.array() });
    // }
    try {
        const { email, password } = req.body;

        const user: IUser | undefined | null = await UserCollection.findOne({
            email: email,
        })
        if (!user) {
            return res.status(400).json({
                status: APP_STATUS.FAILED,
                data: null,
                msg: "Invalid Email Address"
            })
        }

        const isMatch: boolean = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                status: APP_STATUS.FAILED,
                data: null,
                msg: "Invalid Password"
            })
        }

        const secretKey: string | undefined = process.env.JWT_SECRET_KEY;
        const payload: any = {
            users: {
                id: user.id,
                email: user.email
            }
        }
        // console.log(secretKey, payload);

        if (payload && secretKey) {
            Jwt.sign(payload, secretKey, {
                expiresIn: 1000000
            }, (err, encoded) => {
                if (err) { throw err; }
                if (encoded) {
                    // console.log(secretKey, payload);
                    return res.status(200).json({
                        status: APP_STATUS.SUCCESS,
                        data: user,
                        token: encoded,
                        msg: "Login Success"
                    })
                }
            })
        }
    }
    catch (err: any) {
        res.status(400).json({
            status: APP_STATUS.FAILED,
            data: null,
            msg: err.message
        })
    }
}



/**
* @usage : Me request
* @url : http://localhost:2508/users/login/me
* @params : no-params
* @method : GET
* @access : PRIVATE
*/

export const me = async (req: Request, res: Response) => {
    try {
        const userObj: any = await req.headers['user-data'];
        const userid = userObj.id;
        const mongoId = await new mongoose.Types.ObjectId(userid);
        const user: IUser | undefined | null = await UserCollection.findById(mongoId);
        if (user) {
            res.status(200).json({
                status: APP_STATUS.SUCCESS,
                data: user,
                msg: "Login Success"
            })
        }
    }
    catch (err: any) {
        res.status(400).json({
            status: APP_STATUS.FAILED,
            data: null,
            msg: err.message
        })
    }
}

