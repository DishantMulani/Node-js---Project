import { Router, Request, Response } from "express";
import * as userController from '../controllers/userController'
import { body } from "express-validator";
import { tokenVerifier } from '../middelwares/tokenVerifier'

const userRouter: Router = Router();


userRouter.get("/", async (req: Request, res: Response) => {
    await userController.getAllUsers(req, res);
})

userRouter.get("/:userId", async (req: Request, res: Response) => {
    await userController.getUser(req, res);
})

userRouter.put("/:userId", async (req: Request, res: Response) => {
    await userController.updateUser(req, res);
})

userRouter.delete("/:userId", async (req: Request, res: Response) => {
    await userController.deleteUser(req, res);
})

userRouter.post("/register", [
    body("name").isEmpty().withMessage("Name Is Required"),
    body("email").isEmpty().isEmail().withMessage("Email Is Required"),
    body("password").isEmpty().isStrongPassword({ minLength: 8 }).withMessage("Password Is Required")
], async (req: Request, res: Response) => {
    await userController.createUser(req, res);
})

userRouter.post("/login", [
    body("email").isEmpty().isEmail().withMessage("Email Is Required"),
    body("password").isEmpty().isStrongPassword({ minLength: 8 }).withMessage("Password Is Required")
], async (req: Request, res: Response) => {
    await userController.loginUser(req, res);
})

userRouter.get("/login/me", tokenVerifier, async (req: Request, res: Response) => {
    await userController.me(req, res);
})

export default userRouter;