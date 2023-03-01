import { Tour } from "../models/TourModel.js";
import ApiFeatures from "../utills/ApiFeatute.js";

export const getBaseurl = async (req, res) => {
  console.log(req.body.array);
  const features = new ApiFeatures(Tour.find(), req.query)
    .filtering()
    .sorting()
    .limiting()
    .paginating();
  const tour = await features.query;

  return res.status(200).json({
    status: "success",
    length: tour.length,
    tour: tour,
  });
};

export const postBaseUrl = async (req, res) => {
  const { name, rating, price, tags } = req.body;
  try {
    const newTour = await Tour.create({ name, rating, price, tags });
    res.status(200).json(newTour);
  } catch (err) {
    res.status(400).json({ res: err });
  }
};

export const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    return res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({ err });
  }
};

export const postTour = async (req, res) => {
  const { name, rating, price, tags } = req.body;
  console.log(req.body);
  try {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      { name, rating, price, tags },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ status: "success", data: tour });
  } catch (err) {
    res.status(400).json({ err });
  }
};

export const DeleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: "success", data: "null" });
  } catch (err) {
    res.status(400).json({ err });
  }
};

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
