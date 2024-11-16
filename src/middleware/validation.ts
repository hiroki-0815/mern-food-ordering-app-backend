import {Request, Response, NextFunction, RequestHandler } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async(req: Request, res: Response, next: NextFunction):Promise<void> =>{
const errors = validationResult(req);
if(!errors.isEmpty()){
    res.status(400).json({errors: errors.array()})
    return
}
next();
}

export const validateMyUserRequest: RequestHandler[] = [
  body("name").isString().notEmpty().withMessage("Name must be a string"),
  body("addressLine1").isString().notEmpty().withMessage("AddressLine1 must be a string"),
  body("city").isString().notEmpty().withMessage("City must be a string"),
  body("country").isString().notEmpty().withMessage("Country must be a string"),
  handleValidationErrors,
];

export const validateMyRestaurantRequest: RequestHandler[] = [
  body("restaurantName").isString().notEmpty().withMessage("restaurantName must be a string"),
  body("city").isString().notEmpty().withMessage("city must be a string"),
  body("country").isString().notEmpty().withMessage("country must be a string"),
  body("deliveryPrice").isFloat().notEmpty().withMessage("deliveryPrice must be a string"),
  body("estimatedDeliveryTime").isInt({min:0}).withMessage("estimatedDeliveryTime must be a positive integer"),
  body("cuisines").isArray().withMessage("cuisines must be an array").not().isEmpty().withMessage("cuisines aaray cannot be empty"),
  body("menuItems").isArray().withMessage("menuItems must be an array"),
  body("menuItems.*.name").notEmpty().withMessage("Menu item name is required"),
  body("menuItems.*.price").isFloat({min:0}).withMessage("Menu item price is required and must be a positive number"),
  handleValidationErrors,
];