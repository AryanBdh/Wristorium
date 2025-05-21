import bgimg from "./images/bgimg.png";

const Banner = () => {
  return (
    <>
      <div className="relative w-full h-[40vh] sm:h-[70vh] md:h-[90vh]">
        <img
          src={bgimg}
          className="w-full h-full object-cover object-center"
          alt="Hero"
        />
        <div className="w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h1  className="text-white text-xl sm:text-2xl md:text-7xl font-bold mt-0">
            Welcome to WHRISTORIUM
          </h1>
          <p  className="text-sm sm:text-base md:text-2xl text-gray-300 mt-4">
            Your one-stop shop for the finest watches.
          </p>
        </div>
      </div>
    </>
  )
}

export default Banner
