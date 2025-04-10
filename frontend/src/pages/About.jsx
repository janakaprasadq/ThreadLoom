import React from "react";
import Title from "../components/Title";
import NewsLetterBox from "../components/NewsLetterBox";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab atque
            assumenda deserunt, vel quisquam doloribus accusantium porro
            dolores, eius id fugiat, aperiam iure molestiae unde saepe
            blanditiis hic cumque non!
          </p>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel vitae
            eum maxime explicabo iusto soluta enim recusandae consequuntur quod
            esse! Necessitatibus maxime laboriosam molestias tempore accusamus
            amet sequi illum voluptatem?
          </p>
          <b className="text-gray-600">Our Vision</b>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
            quibusdam dolore nihil! Veritatis aliquid, dolore corrupti similique
            ipsum totam architecto quo amet, eum debitis vero, molestias aliquam
            assumenda magni esse?
          </p>
        </div>
      </div>

      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Accusantium, deleniti corrupti consequatur odit dolorem aliquam
            molestiae deserunt illo, fugit sunt alias id! Temporibus commodi
            corrupti recusandae, suscipit quisquam facere id?
          </p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience: </b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
            inventore sed ab ducimus illo corrupti ullam culpa, beatae laborum.
            Tempora corrupti harum id dolor tempore maxime perspiciatis beatae
            repudiandae assumenda.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat,
            eum error ad optio quis veritatis vitae mollitia ea quaerat nesciunt
            delectus cumque, voluptate sequi cum in ipsa, consequatur corporis?
            Placeat?
          </p>
        </div>
      </div>
      <NewsLetterBox />
    </div>
  );
};

export default About;
