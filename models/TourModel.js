import mongoose from "mongoose";
import slugify from "slugify";
import { Reviews } from "./ReviewModel.js";

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: [true, "Name already exists"],
    },
    rating: {
      type: Number,
      max: [5, "Rating should be less than 5"],
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, "Price Field is Missing"],
    },
    creatdAt: {
      type: Date,
      default: Date.now(),
      // select: false,
    },
    tags: {
      type: [String],
    },
    slug: {
      type: String,
      immutable: true,
    },
    secretTour: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("PriceInUsd").get(function () {
  return (this.price / 760).toFixed(2);
});

tourSchema.virtual("reviews", {
  ref: "Reviews",
  foreignField: "tour",
  localField: "_id",
});

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true, trim: true });
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
tourSchema.pre("findOne", function () {
  this.select("-__v").populate({
    path: "reviews",
    select: "-__v -tour",
  });
});

export const Tour = mongoose.model("Tour", tourSchema);
