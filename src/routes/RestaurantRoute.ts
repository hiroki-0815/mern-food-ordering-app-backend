import express from "express";
import { param } from "express-validator"
import { getRestaurant, searchRestaurants } from "../controllers/RestaurantController";

const router = express.Router();

router.get(
  "/:restaurantId",
  param("restaurantId")
.isString()
.trim()
.notEmpty()
.withMessage("RestaurantId param must be a valid string"),
getRestaurant
)

router.get("/search/:city",
param("city")
.isString()
.trim()
.notEmpty()
.withMessage("City param must be a valid string"),
searchRestaurants
)

export default router;