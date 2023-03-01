import express from "express";
import {
  getBaseurl,
  postBaseUrl,
  getTour,
  postTour,
  DeleteTour,
  TourTopAlias,
  getStats,
  unwind
} from "../controllers/tourController.js";

const router = express.Router();
router.route("/cheapest").get(TourTopAlias, getBaseurl);
router.route("/unwind").get(unwind)
router.route("/stats").get(getStats)
router.route("/").get(getBaseurl).post(postBaseUrl);
router.route("/:id").get(getTour).post(postTour).delete(DeleteTour);

export default router;
