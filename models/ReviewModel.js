import mongoose from "mongoose";
import { Tour } from "./TourModel.js";
import AppError from "../utills/AppError.js";

const reviewSchema = new mongoose.Schema({
    body:{
        type:String,
        required:[true,"body is missing"],
    },
    summary:{
        type:String,
        required:[true,"summary Field is missing"],
    },
    createdAt:Date,
    rating:{
      type:Number,
      required:[true,"please Enter A rating value"],
      max:[5,"rating should not be greater than 5"]
    },
    tour:{
        required:[true,"Enter tour review should be associated with"],
        type: mongoose.Schema.Types.ObjectId,
        ref:"Tour"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"TourUser"
    },
})  

reviewSchema.pre("save",async function(next){
    const tour =await Tour.findById(this.tour)
    if(!tour){return next(AppError("Tour Id is invalid",401))}
    this.createdAt  = Date.now()
    next()
})
reviewSchema.pre(/^find/,function(next){
    this.select("-__v").populate({
      path:"tour user",
      select:"name"
    })
    next()
})

export const Reviews = mongoose.model("Reviews",reviewSchema)