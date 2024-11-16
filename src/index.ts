import "dotenv/config"; 
import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
import {v2 as cloudinary} from "cloudinary"
import myRestaurantRoute from "./routes/MyRestaurantRoute"

const PORT = process.env.PORT || 7001;

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to database!"))
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })


// Express App Setup
const app = express();
app.use(express.json());
app.use(cors());

// Health Check Endpoint
app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "Health OK!" });
});

// User Routes
app.use("/api/my/user", myUserRoute);
// Restaurant Routes
app.use("/api/my/restaurant", myRestaurantRoute)

// Start the Server
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});     
