import React from "react";
import { Link } from "react-router-dom";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

import "@fontsource/poppins"; // Default weight

const Hero = () => {
  return (
    <div className="bg-white h-auto lg:h-[89vh] w-full flex flex-col lg:flex-row px-10 py-8 lg:py-0">
      {/* Blurred Background */}
      <div
        className="absolute left-0 z-10 transform-gpu overflow-hidden px-36 blur-3xl pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#007E6F] to-[#007E6F] opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>

      {/* Buttons and Content */}
      <div className="relative w-full lg:w-3/6 h-full flex items-center justify-center z-11">

        <div className="w-full ">
          <h1 className="text-black text-6xl font-semibold text-center lg:text-left font-poppins">
            Discover, Publish and Read Your Favourite Books!
          </h1>
          <p className="text-xl text-zinc-800 mt-5 text-center lg:text-left font-poppins">
            Explore our Vast collection of books from diverse authors. Weather
            you're here to publish your own work or find your next great read,
            we've got you covered. Join our community of readers and authors
            today.
          </p>
          <div className="flex justify-center lg:justify-start">
            <Link
              to="/all-books"
              className="relative overflow-hidden my-5 lg:my-8 text-lg bg-black text-white rounded-lg py-3 px-8 flex items-center justify-center font-semibold border-2 border-transparent hover:border-[#007E6F] hover:bg-gradient-to-r hover:from-[#007E6F] hover:to-[#005f56] hover:text-white transition-all duration-300 font-poppins group active:scale-95"
            >
              <span className="relative z-10">Discover More</span>
              <FaRegArrowAltCircleRight className="ml-2 text-lg relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <span className="absolute inset-0 bg-gradient-to-r from-[#007E6F] to-[#005f56] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-3/6 h-auto lg:h-[100%] flex items-center justify-center  ">
        <img
          src="/Hero.jpeg"
          alt="hero"
          className="w-[500px] h-[500px] object-cover"
        />
      </div>
    </div>
  );
};

export default Hero;
