import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: [true, "Name already exists"],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "Price Field is Missing"],
  },
  creatdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  tags: {
    type: [String],
  },
});

export const Tour = mongoose.model("Tour", tourSchema);
