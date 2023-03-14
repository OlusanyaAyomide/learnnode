import { Tour } from "../models/TourModel.js";
import catchAsync from "../utills/RolesandError.js";
import ApiFeatures from "../utills/ApiFeatute.js";
import AppError from "../utills/AppError.js";
import slugify from "slugify";
import { Reviews } from "../models/ReviewModel.js";

export const getBaseurl = catchAsync(async (req, res) => {
  const features = new ApiFeatures(Tour.find(), req.query)
    .filtering()
    .sorting()
    .limiting()
    .paginating();
  const tour = await features.query;

  res.status(200).json({
    status: "success",
    length: tour.length,
    user: req.user,
    tour: tour,
  });
});

export const postBaseUrl = catchAsync(async (req, res, next) => {
  const { name, rating, price, tags, secretTour } = req.body;
  const newTour = await Tour.create({ name, rating, price, tags, secretTour });
  res.status(200).json(newTour);
});

export const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  console.log(tour);
  if (!tour) {
    console.log("heree");
    return next(new AppError("No tour is found", 404));
  }
  return res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

export const postTour = catchAsync(async (req, res, next) => {
  const { name, rating, price, tags, secretTour } = req.body;
  let slug;
  if (name) {
    slug = slugify(name, { lower: true, trim: true });
  }
  const tour = await Tour.findByIdAndUpdate(
    req.params.id,
    { name, rating, price, tags, secretTour, slug },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!tour) {
    console.log("heree");
    return next(new AppError("No tour is found", 404));
  }
  res.status(200).json({ status: "success", data: tour });
});

export const DeleteTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({ status: "success", data: "null" });
});

export const TourTopAlias = async (req, res, next) => {
  req.query.sort = "price,-rating";
  req.query.limit = "10";
  next();
};

export const getStats = async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        rating: { $gte: 4 },
      },
    },
    {
      $group: {
        _id: "$rating",
        tourCount: { $sum: 1 },
        ratingAvg: { $avg: "$rating" },
        maxPrice: { $max: "$price" },
        totalRating: { $sum: "$rating" },
        minPrice: { $min: "$price" },
        averagePrice: { $avg: "$price" },
      },
    },
    {
      $sort: { ratingAvg: 1 },
    },
  ]);
  return res.status(200).json({
    status: "success",
    stats,
  });
};

export const unwind = async (req, res) => {
  const stat = await Tour.aggregate([
    {
      $unwind: "$tags",
    },
    {
      $group: {
        _id: "$tags",
        tagsCount: { $sum: 1 },
      },
    },
  ]);
  return res.status(200).json({
    status: "success",
    stat,
  });
};


export const postReview = catchAsync(async (req,res,next)=>{
    const {body,summary,tour,rating} = req.body;
    const review = await Reviews.create({body,summary,tour,rating,user:req.user.id})
    return res.status(200).json({
      status:"success",
      data:{review}
    })  
})

export const getReviews = catchAsync(async(req,res,next)=>{
  const reviews = await Reviews.find({})
  return res.status(200).json({
    status:"success",data:{reviews}
  })
})