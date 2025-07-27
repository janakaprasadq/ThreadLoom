import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} color="#FF5733" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} color="#FF5733" />);
    } else {
      stars.push(<FaRegStar key={i} color="#FF5733" />);
    }
  }

  return <div className="flex">{stars}</div>;
};

export default StarRating;
