import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import axios from "axios";

const Orders = () => {
  const { backendUrl, token, currency, user } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [reviewForms, setReviewForms] = useState({}); // to toggle review form for each product
  const [reviewInputs, setReviewInputs] = useState({}); // to store input data
  const [reviews, setReviews] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            item["orderId"] = order._id;
            item["productId"] = item._id;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {}
  };

  const toggleReviewForm = (productId) => {
    setReviewForms((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleReviewChange = (productId, field, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const submitReview = async (pid, productId, orderId) => {
    const review = reviewInputs[pid];
    if (!review || !review.rating || !review.comment) return;

    console.log("Submitting review for product:", productId);
    console.log("Order ID:", orderId);
    console.log("Review payload:", {
      userId: user?._id,
      productId,
      orderId,
      rating: review.rating,
      comment: review.comment,
    });

    try {
      const response = await axios.post(
        backendUrl + "/api/review/add",
        {
          userId: user?._id,
          productId,
          orderId,
          rating: review.rating,
          comment: review.comment,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        console.log("Review response:", response.data);
        alert("Review submitted!");
        await fetchUserReviews();
        //setReviewForms((prev) => ({ ...prev, [productId]: false }));
        setReviewForms((prev) => ({ ...prev, [pid]: false }));

        setReviewInputs((prev) => ({ ...prev, [productId]: {} }));
      } else {
        alert("Error submitting review");
      }
    } catch (error) {
      alert("Failed to submit review");
      console.error(error);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/review/user/${user._id}`);
      if (res.data.success) {
        setReviews(res.data.reviews);
      }
    } catch (err) {
      console.error("Failed to fetch user reviews", err);
    }
  };

  const hasReviewed = (productId, orderId) =>
    reviews.some((r) => r.productId === productId && r.orderId === orderId);

  useEffect(() => {
    loadOrderData();
  }, [token]);

  useEffect(() => {
    if (user?._id) {
      fetchUserReviews();
    }
  }, [user]);

  const reviewsMap = reviews.reduce((acc, review) => {
    const key = `${review.orderId}_${review.productId}`;
    acc[key] = review;
    return acc;
  }, {});

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div>
        {orderData.map((item, index) => {
          //const pid = item.productId || item._id;
          const pid = `${item.orderId}_${item.productId}_${item.size}`;

          return (
            <div
              key={index}
              className="py-4 border-b text-gray-700 flex flex-col gap-4"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-6 text-sm">
                  <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
                  <div>
                    <p className="sm:text-base font-medium">{item.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                      <p>
                        {currency}
                        {item.price}
                      </p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Size: {item.size}</p>
                    </div>
                    <p className="mt-1">
                      Date:{" "}
                      <span className="text-gray-400">
                        {new Date(item.date).toDateString()}
                      </span>
                    </p>
                    <p className="mt-1">
                      Payment:{" "}
                      <span className="text-gray-400">
                        {item.paymentMethod}
                      </span>
                    </p>
                    <p className="mt-1">
                      Order ID:{" "}
                      <span className="text-gray-400">{item.orderId}</span>
                    </p>
                    {/* --- Show Review if Exists --- */}
                    {reviewsMap[`${item.orderId}_${item.productId}`] && (
                      <div className="mt-1">
                        <p className="font-semibold text-gray-800 mb-1">
                          Your Review
                        </p>
                        <p>
                          <strong>Rating:</strong>{" "}
                          {
                            reviewsMap[`${item.orderId}_${item.productId}`]
                              .rating
                          }{" "}
                          ⭐
                        </p>
                        <p>
                          <strong>Comment:</strong>{" "}
                          {
                            reviewsMap[`${item.orderId}_${item.productId}`]
                              .comment
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:w-1/2 flex justify-between">
                  <div className="flex items-center gap-2">
                    <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                    <p className="text-sm md:text-base">{item.status}</p>
                  </div>
                  <button
                    onClick={loadOrderData}
                    className="border px-4 py-2 text-sm font-medium rounded-sm"
                  >
                    Track Order
                  </button>
                </div>
              </div>

              {/* --- Write Review Button --- */}
              {item.status === "Delivered" &&
                !hasReviewed(item.productId, item.orderId) && (
                  <button
                    className="text-sm text-blue-600 underline mt-2 w-fit"
                    onClick={() => toggleReviewForm(pid)}
                  >
                    {reviewForms[pid] ? "Cancel" : "Write Review"}
                  </button>
                )}

              {/* --- Review Form --- */}
              {reviewForms[pid] && (
                <div className="mt-2 border rounded p-4">
                  <p className="text-sm font-medium mb-2">Write a Review</p>
                  <div className="flex gap-4 mb-2">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      placeholder="Rating (1-5)"
                      className="border px-2 py-1 w-20 text-sm"
                      onChange={(e) =>
                        handleReviewChange(pid, "rating", e.target.value)
                      }
                    />
                    <textarea
                      placeholder="Write your comment"
                      className="border px-2 py-1 w-full text-sm"
                      rows="2"
                      onChange={(e) =>
                        handleReviewChange(pid, "comment", e.target.value)
                      }
                    ></textarea>
                  </div>
                  <button
                    onClick={() =>
                      submitReview(pid, item.productId, item.orderId)
                    }
                    className="bg-black text-white px-4 py-2 text-sm"
                  >
                    Submit Review
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
