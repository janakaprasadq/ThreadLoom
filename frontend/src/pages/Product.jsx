import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { ShopContext } from "../context/ShopContext";
import StarRating from "../components/StartRating";
import { backendUrl } from "../../../admin/src/App";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [selectedSizeInfo, setSelectedSizeInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);

        return null;
      }
    });
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(backendUrl + `/api/review/${productId}`);
      const data = await res.json();
      setReviews(data.reviews);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  useEffect(() => {
    fetchProductData();
    fetchReviews();
  }, [productId, products]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/*-------------------------Product data -----------------------------------*/}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/*-------------------Product images ---------------------*/}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
                onClick={() => setImage(item)}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>

        {/*--------------------Poduct info------------------------*/}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <div className="pl-2 flex items-center gap-2">
              <StarRating rating={productData.averageRating || 0} />
              <p className="text-sm text-gray-600">
                ({productData.reviewCount || 0} review
                {productData.reviewCount === 1 ? "" : "s"})
              </p>
            </div>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          {/* <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? "border-orange-500" : ""
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div> */}

          {/* <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => item.quantity > 0 && setSize(item.size)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item.size === size ? "border-orange-500" : ""
                  } ${
                    item.quantity === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  key={index}
                  disabled={item.quantity === 0}
                >
                  {item.size} {item.quantity === 0 && "(Out of stock)"}
                </button>
              ))}
            </div>
          </div> */}

          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-4 flex-wrap">
              {productData.sizes.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <button
                    onClick={() => {
                      if (item.quantity > 0) {
                        setSize(item.size);
                        setSelectedSizeInfo(item);
                      }
                    }}
                    className={`border py-2 px-4 bg-gray-100 text-sm rounded-md ${
                      item.size === size ? "border-orange-500" : ""
                    } ${
                      item.quantity === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={item.quantity === 0}
                  >
                    {item.size}
                  </button>
                  {item.quantity === 0 && (
                    <span className="text-xs text-red-500 mt-1">
                      Out of stock
                    </span>
                  )}
                </div>
              ))}
            </div>
            {selectedSizeInfo && (
              <p className="text-sm text-gray-700 mt-2">
                Available Quantity: {selectedSizeInfo.quantity}
              </p>
            )}
          </div>

          <button
            onClick={() => addToCart(productData._id, size)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/*---------Description and Review Section ----------------  */}
      <div className="mt-20">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-5 py-3 text-sm font-semibold ${
              activeTab === "description"
                ? "border-b-2 border-black"
                : "text-gray-500"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-5 py-3 text-sm font-semibold ${
              activeTab === "reviews"
                ? "border-b-2 border-black"
                : "text-gray-500"
            }`}
          >
            Reviews ({productData.reviewCount})
          </button>
        </div>

        <div className="border px-6 py-6 text-sm text-gray-600">
          {activeTab === "description" && (
            <div className="flex flex-col gap-4">
              <p>{productData.description}</p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="flex flex-col gap-4">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="border-b pb-4 mb-4">
                    <p className="text-base font-semibold">
                      {review.userId?.name || review.userName || "Anonymous"}
                    </p>
                    <StarRating rating={review.rating || 0} />
                    <p className="text-sm text-gray-700 mt-1">
                      {review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ---------Display related products --------------- */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
