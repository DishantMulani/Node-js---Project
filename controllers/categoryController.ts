import { Request, Response } from "express";
import { ThrowError } from "../util/ErrorUtil";
import * as UserUtil from "../util/UserUtil";
import { ICategory, ISubCategory } from "../models/ICategory";
import { CategoryCollection, SubCategoryCollection } from "../schemas/CategorySchema";
import { APP_STATUS } from "../constant/constants";
import mongoose from "mongoose";



/**
* @usage : Create a Category
* @url : http://localhost:9000/api/categories/
* @params : name, description
* @method : POST
* @access : PRIVATE
*/

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const theUser: any = await UserUtil.getUser(req, res);
        if (theUser) {
            // check of the category is exists
            const categoryObj: ICategory | undefined | null = await CategoryCollection.findOne({ name: name });
            if (categoryObj) {
                return ThrowError(res, 401, "Category is already exists!");
            }
            // create
            const theCategory: ICategory = {
                name: name,
                description: description,
                subCategories: [] as ISubCategory[]
            }

            const savedCategory = await new CategoryCollection(theCategory).save();
            if (savedCategory) {
                return res.status(200).json({
                    status: APP_STATUS.SUCCESS,
                    data: savedCategory,
                    msg: "New Category is Created!"
                })
            }
        }
    } catch (error) {
        return ThrowError(res);
    }
};


/**
* @usage : Create a Sub Category
* @url : http://localhost:9000/api/categories/:categoryId
* @params : name, description
* @method : POST
* @access : PRIVATE
*/

export const createSubCategory = async (req: Request, res: Response) => {
    try {
        const { categoryId } = req.params;
        const mongoCategoryId = new mongoose.Types.ObjectId(categoryId);
        const { name, description } = req.body;
        const theUser: any = await UserUtil.getUser(req, res);
        if (theUser) {
            // check if the subCategory is exists
            let theCategory: any = await CategoryCollection.findById(mongoCategoryId);
            if (!theCategory) {
                return ThrowError(res, 404, "Category is not exists!");
            }
            let theSubCategory: any = await SubCategoryCollection.findOne({
                name: name
            });


            if (theSubCategory) {
                return ThrowError(res, 401, "SubCategory is already exists!");
            }

            let theSub = await new SubCategoryCollection({
                name: name,
                description: description
            }).save();


            if (theSub) {
                theCategory.subCategories.push(theSub);
                let categoryObj = await theCategory.save();
                if (categoryObj) {
                    return res.status(201).json({
                        msg: 'Sub Category is Created!',
                        status: APP_STATUS.SUCCESS,
                        data: categoryObj
                    });
                }
            }
        }
    } catch (error) {
        console.log(error);
        return ThrowError(res);
    }
};


/**
* @usage : Get all categories
* @url : http://localhost:9000/api/categories/
* @params : no-params
* @method : GET
* @access : PUBLIC
*/

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await CategoryCollection.find().populate({
            path: "subCategories",
            strictPopulate: false
        });

        return res.status(200).json({
            status: APP_STATUS.SUCCESS,
            data: categories,
            msg: "Categories found"
        });
    } catch (error) {
        return ThrowError(res);
    }
};
