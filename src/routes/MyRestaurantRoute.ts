import express from "express";
import multer from "multer";
import { createMyRestaurant, getMyRestaurant } from "../controllers/MyrestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5mb
  },
});

router.get("/", jwtCheck, jwtParse, getMyRestaurant)

router.post("/",
upload.single("imageFile"),
validateMyRestaurantRequest,
jwtCheck,
jwtParse,
createMyRestaurant);

export default router;
