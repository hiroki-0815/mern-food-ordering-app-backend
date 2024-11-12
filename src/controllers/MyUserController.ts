// controllers/MyUserController.ts
import { Request, Response, RequestHandler } from "express";
import User from "../models/user";

export const getCrrentUser: RequestHandler = async (req: Request, res: Response): Promise<void>  => {
  try {
    const currentUser = await User.findOne({_id: req.userId})
    if(!currentUser){
     res.status(404).json({message: "User not found"})
     return
    }

    res.json(currentUser)
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Something went wrong"})
    return
  }
}

export const createCurrentUser: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      res.status(200).send();
      return;  
    }

    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json(newUser.toObject());
    return;  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
    return; 
  }
};

export const updateCurrentUser: RequestHandler = async(req: Request, res: Response): Promise<void> =>{
  try {
    const {name, addressLine1, country, city} =req.body;
    const user = await User.findById(req.userId)

    if(!user){
       res.status(404).json({message: "User not found"})
       return;
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country =country;

    await user.save();
    res.send(user);
    
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Error updating user"})
  }
}