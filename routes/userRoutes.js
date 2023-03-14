import express from "express";
import {
  getUsers,
  logInUser,
  signUp,
  DeleteUser,ResetPassword,setNewPassword
} from "../controllers/AuthController.js";
import { routeProtector, roleProtectour } from "../utills/RolesandError.js";

const router = express.Router();

router.post("/signup", signUp);
router
  .route("/")
  .get(routeProtector, roleProtectour("admin", "staff"), getUsers);
router.route("/login").post(logInUser);
router.route("/delete-user").delete(routeProtector, DeleteUser);
router.route("/reset-password").post(ResetPassword);
router.route("/reset-password/:token").get(setNewPassword)

export default router;
