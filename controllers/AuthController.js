import { TourUser } from "../models/UserModel.js";
import catchAsync from "../utills/RolesandError.js";
import ApiFeatures from "../utills/ApiFeatute.js";
import jwt from "jsonwebtoken";
import AppError from "../utills/AppError.js";
import crypto from "crypto";

export const signUp = catchAsync(async (req, res, next) => {
  const user = await TourUser.create(req.body);
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  return res.status(201).json({
    status: "success",
    token,
    message: user,
  });
});

export const getUsers = catchAsync(async (req, res, next) => {
  const users = new ApiFeatures(TourUser.find(), req.query)
    .filtering()
    .sorting()
    .limiting()
    .paginating();
  const allUsers = await users.query;
  res.status(200).json({
    status: "success",
    length: allUsers.length,
    message: allUsers,
  });
});

export const logInUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Enter Email And Pasword", 400));
  }
  const user = await TourUser.findOne({ email }).select("+password");
  const isPasswordCorrect = await user?.checkPassword(password, user.password);
  if (!user || !isPasswordCorrect) {
    return next(new AppError("Email or password is Incorrect", 400));
  }
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  res.status(200).json({
    status: "success",
    token,
  });
});

export const DeleteUser = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  console.log(userId);
  const user = await TourUser.findByIdAndDelete(userId);
  return res.status(201).json({
    status: "success",
    data: null,
  });
});

export const ResetPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    return next(new AppError("Email Field is required"), 400);
  }
  const user = await TourUser.findOne({ email: req.body.email });
  const resetlink = user.generateResetLink();
  await user.save({ validateBeforeSave: false });
  return res.status(200).json({ resetlink });
});

export const setNewPassword = catchAsync(async (req, res, next) => {
  const PassswordresetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await TourUser.findOne({ PassswordresetToken ,resetTimer:{$gt:Date.now()}});
  if (!user) {
    return next(new AppError("Token is Invalid"), 400);
  }
  user.password = req.body.password
  user. passwordConfirmation = req.body.passwordConfirmation
  user.PassswordresetToken = undefined
  user.resetTimer = undefined
  await user.save()
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  return res.status(200).json({
    status:"success",
    data:{token}
   });
});
