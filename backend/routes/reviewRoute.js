import express from "express";
import {
  addReview,
  getProductReviews,
  getUserReviews,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/add", addReview);
reviewRouter.get("/:productId", getProductReviews);

reviewRouter.get("/user/:userId", getUserReviews);

export default reviewRouter;
