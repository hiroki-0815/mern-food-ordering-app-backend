import express from "express";
import { param } from "express-validator"
import { searchRestaurants } from "../controllers/RestaurantController";

const router = express.Router();

// api/restaurant
router.get("/search/:city",
param("city")
.isString()
.trim()
.notEmpty()
.withMessage("City param must be a valid string"),
searchRestaurants
)

export default router;