import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ProductItem = ({ id, image, name, price, rating, reviewCount }) => {
  const { currency } = useContext(ShopContext);

  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <FaStar
            key={`full-${i}`}
            className="text-yellow-500 text-sm inline"
          />
        ))}
        {hasHalfStar && (
          <FaStarHalfAlt className="text-yellow-500 text-sm inline" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar
            key={`empty-${i}`}
            className="text-yellow-500 text-sm inline"
          />
        ))}
      </>
    );
  };

  return (
    <Link className="text-grat-700 cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 transition ease-in-out"
          src={Array.isArray(image) ? image[0] : image}
          alt=""
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">
        {currency}
        {price}
      </p>
      <div className="flex items-center gap-1 text-sm pt-1">
        <FaStar className="text-yellow-500" />
        <span className="text-gray-600">{rating?.toFixed(1) || "0.0"}</span>
      </div>
    </Link>
  );
};

export default ProductItem;
