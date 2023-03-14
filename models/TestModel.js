import mongoose from "mongoose";
import validator from "validator";

const TestUser = new mongoose.Schema({
  name: {
    type: String,
    minlength: [10, "character must be greater than 10"],
    maxlength: [20, "character must be less than 20"],
    required: true,
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Email is not valid"],
    required: true,
    unique: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Testpost",
    },
  ],
});

const TestPost = new mongoose.Schema({
  name: {
    type: String,
  },
  body: {
    type: String,
    minlength: [20, "post is less than 20 words"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Testuser",
    required: true,
  },
});

TestPost.pre(/^find/, function (next) {
  this.select("-__v").populate({
    path: "author",
    select: "-__v -posts",
  });
  next();
});

export const Testpost = mongoose.model("Testpost", TestPost);
export const Testuser = mongoose.model("Testuser", TestUser);
