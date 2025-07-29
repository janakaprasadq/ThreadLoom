import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { useContext } from "react";

const Profile = () => {
  const { user } = useContext(ShopContext);

  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"MY"} text2={"PROFILE"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px] rounded-lg"
          src={assets.profile_img}
          alt=""
        />

        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <b className="text-gray-600">User Information</b>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
