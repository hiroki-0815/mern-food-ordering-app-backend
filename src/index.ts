import "dotenv/config"; 
import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";

const PORT = process.env.PORT || 7001;

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to database!"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

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

// Start the Server
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
