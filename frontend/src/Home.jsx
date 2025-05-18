import React from "react";
import Header from "./Header";
import bgimg from "./images/bgimg.png";
import Collections from "./Collections";

const Home = () => {
  return (
    <>
      <Header />
      <img src={bgimg} className=" object-cover object-center" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-4xl font-bold text-white">
          Welcome to WHRISTORIUM
        </h1>
        <p className="text-lg text-gray-300 mt-4">
          Your one-stop shop for the finest watches.
        </p>
      </div>

      {/* item showcase */}
      <div className="border-b border-gray-800 bg-[#0F172A] py-7">
  <div className="p-4 max-w-7xl mx-auto">
    <h2 className="text-2xl font-semibold text-center text-white">Featured Items</h2>
    <p className="text-[#B1976B] mt-2 text-center">Check out our latest collection!</p>

    <Collections />
  </div>
</div>

    </>
  );
};

export default Home;
