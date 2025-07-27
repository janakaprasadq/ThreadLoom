import reviewModel from "../models/reviewModel.js";
import orderModel from "../models/orderModel.js";
import mongoose from "mongoose"; //
import productModel from "../models/productModel.js";

const addReview = async (req, res) => {
  const { userId, productId, rating, comment, orderId } = req.body;
  console.log("Review payload:", {
    userId,
    productId,
    rating,
    comment,
    orderId,
  });

  try {
    // Check if this user has a delivered order with this product
    const deliveredOrder = await orderModel.findOne({
      _id: orderId,
      userId,
      status: "Delivered",
    });

    console.log("Delivered order:", deliveredOrder);

    if (!deliveredOrder) {
      return res.json({
        success: false,
        message: "You can only review products after delivery.",
      });
    }

    const productDelivered = deliveredOrder.items.some(
      (item) => item._id.toString() === productId
    );

    console.log("Product delivered:", productDelivered);

    if (!productDelivered) {
      return res.json({
        success: false,
        message: "This product was not part of the delivered order.",
      });
    }

    // Check if review already exists
    const existingReview = await reviewModel.findOne({
      userId,
      productId,
      orderId,
    });

    console.log("Existing review:", existingReview);

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();
      await updateProductRating(productId);
      return res.json({ success: true, message: "Review updated" });
    }

    // Create new review
    const review = new reviewModel({
      userId,
      productId,
      rating,
      comment,
      orderId,
    });
    await review.save();

    await updateProductRating(productId);

    res.json({ success: true, message: "Review added" });
  } catch (error) {
    console.error("Review error:", error);
    res.json({ success: false, message: error.message });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if productId is valid
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const reviews = await reviewModel
      .find({ productId: new mongoose.Types.ObjectId(productId) }) // ✅ Ensure ObjectId match
      .populate("userId", "name");
    res.json({ success: true, reviews });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateProductRating = async (productId) => {
  const reviews = await reviewModel.find({ productId });
  const total = reviews.reduce((acc, r) => acc + r.rating, 0);
  const average = total / reviews.length;

  await productModel.findByIdAndUpdate(productId, {
    averageRating: average,
    reviewCount: reviews.length,
  });
};

const fetchReviews = async () => {
  try {
    const res = await fetch(`/api/reviews/${productId}`);
    const data = await res.json();
    setReviews(data.reviews);
  } catch (err) {
    console.error("Failed to fetch reviews", err);
  }
};

const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await reviewModel.find({ userId });
    res.json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch reviews" });
  }
};

export { addReview, getProductReviews, getUserReviews };
