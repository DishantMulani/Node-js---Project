import { Router, Request, Response } from 'express';
import { body } from "express-validator";
import { tokenVerifier } from "../middelwares/tokenVerifier";
import { validateForm } from "../middelwares/validateForm";
import * as categoryController from "../controllers/categoryController";
const categoriesRouter: Router = Router();


/**
* @usage : Create a Category
* @url : http://localhost:9000/api/categories/
* @params : name, description
* @method : POST
* @access : PRIVATE
*/
categoriesRouter.post("/", [
    body('name').not().isEmpty().withMessage("Name is required"),
    body('description').not().isEmpty().withMessage("Description is required"),
], tokenVerifier, validateForm, async (req: Request, res: Response) => {
    await categoryController.createCategory(req, res);
});


/**
* @usage : Create a Sub Category
* @url : http://localhost:9000/api/categories/:categoryId
* @params : name, description
* @method : POST
* @access : PRIVATE
*/
categoriesRouter.post("/:categoryId", [
    body('name').not().isEmpty().withMessage("Name is required"),
    body('description').not().isEmpty().withMessage("Description is required"),
], tokenVerifier, validateForm, async (req: Request, res: Response) => {
    await categoryController.createSubCategory(req, res);
});


/**
* @usage : Get all categories
* @url : http://localhost:9000/api/categories/
* @params : no-params
* @method : GET
* @access : PUBLIC
*/
categoriesRouter.get("/", async (req: Request, res: Response) => {
    await categoryController.getAllCategories(req, res);
});
export default categoriesRouter;
