import {Request, RequestHandler, Response} from "express"
import Restaurant from "../models/restaurant";
import cloudinary from "cloudinary"
import mongoose from "mongoose";
import Order from "../models/ordermodel";

export const getMyRestaurant: RequestHandler = async (req: Request, res: Response) =>{
  try {
    const currentRestaurant = await Restaurant.findOne({user: req.userId})
    if(!currentRestaurant){
     res.status(404).json({message: "Restaurant not found"})
     return
    }

    res.json(currentRestaurant)
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Something went wrong"})
    return
  }
}

export const createMyRestaurant: RequestHandler = async (req: Request, res: Response)=>{
  try {
    const existingRestaurant = await Restaurant.findOne({user: req.userId})

    if(existingRestaurant) { res.status(409).json({message: "User restaurant already exist"})
    return}

    // const image = req.file as Express.Multer.File;
    // const base64Image = Buffer.from(image.buffer).toString("base64");
    // const dataURI = `data:${image.mimetype};base64,${base64Image}`

    // const uploadResponse = await cloudinary.v2.uploader.upload(dataURI)

    const imageUrl = await uploadImage(req.file as Express.Multer.File)

    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = imageUrl
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date;
    await restaurant.save();

    res.status(201).send(restaurant)
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Something went wrong"})
  }
}


export const updateMyRestaurant: RequestHandler = async(req: Request, res: Response) =>{
  try {
    const {restaurantName, city,country, deliveryPrice, estimatedDeliveryTime, cuisines, menuItems} =req.body;
    const restaurant = await Restaurant.findOne({user: req.userId})

    if(!restaurant){
       res.status(404).json({message: "Restaurant not found"})
       return;
    }

  restaurant.restaurantName = restaurantName
  restaurant.city = city
  restaurant.country =  country
  restaurant.deliveryPrice = deliveryPrice
  restaurant.estimatedDeliveryTime = estimatedDeliveryTime
  restaurant.cuisines = cuisines
  restaurant.menuItems = menuItems
  restaurant.lastUpdated = new Date();

  if(req.file){
    const imageUrl = await uploadImage(req.file as Express.Multer.File)
    restaurant.imageUrl = imageUrl
  }

    await restaurant.save();
    res.status(200).send(restaurant);
    
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Error updating restaurant"})
  }
}

export const getMyRestaurantOrders: RequestHandler = async(req: Request, res: Response): Promise<void>=>{
  try {
    const restaurant = await Restaurant.findOne({user: req.userId})
    if(!restaurant){
     res.status(404).json({message:"restaurant not found"})
     return
    }
    const orders = await Order.find({restaurant: restaurant._id})
    .populate("restaurant")
    .populate("user")

    res.json(orders)

  } catch (error) {
    console.log(error);
    res.status(500).json({message:"something went wrong"})
  }
}

export const updateOrderStatus: RequestHandler = async(req: Request, res: Response) =>{
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if(!order){
      res.status(404).json({message: "order not found"})
      return;
    }

    const restaurant = await Restaurant.findById(order.restaurant);

    if(restaurant?.user?._id.toString() !== req.userId){
     res. status(401).send()
     return;
    }

    order.status = status;
    await order.save();

    res.status(200).json(order)
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Unable to update order status"})
    
  }
}

const uploadImage = async (file: Express.Multer.File) =>{

  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI)
  return uploadResponse.url
}


