import express from "express";
import { routeProtector } from "../utills/RolesandError.js";
import {
  getBaseurl,
  postBaseUrl,
  getTour,
  postTour,
  DeleteTour,
  TourTopAlias,
  getStats,
  unwind,
  postReview,getReviews
} from "../controllers/tourController.js";
import {
  GetallUser,
  PostnewUser,
  PostNewPost,
  GetAllPost
} from "../controllers/testController.js";

const router = express.Router();

router.route("/cheapest").get(TourTopAlias, getBaseurl);
router.route("/test/user").get(GetallUser).post(PostnewUser);
router.route("/posts").post(PostNewPost);
router.route("/unwind").get(unwind);
router.route("/reviews").get(getReviews).post(routeProtector,postReview)
router.route("/stats").get(getStats);
router.route("/").get(routeProtector, getBaseurl).post(postBaseUrl);
router.route("/:id").get(getTour).post(postTour).delete(DeleteTour);
router.route("/test/posts").get(GetAllPost);


export default router;
