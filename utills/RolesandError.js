import AppError from "./AppError.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { TourUser } from "../models/UserModel.js";

export default function catchAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
}

export const routeProtector = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
    return next(new AppError("log in before accessting this route", 401));
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded.id);
  const user = await TourUser.findById(decoded.id);
  if (!user) return next(new AppError("This user has been deleted", 401));
  req.user = decoded;
  next();
});

export const roleProtectour = (...roles) => {
  return async (req, res, next) => {
    const user = await TourUser.findById(req.user.id);
    if (!roles.includes(user.roles)) {
      return next(
        new AppError("You do not have required permission for this action", 403)
      );
    }
    next();
  };
};
