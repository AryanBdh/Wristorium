import Header from "../Header";
import bgimg from "../images/bgimg.png";
import Collections from "../Collections";
import Footer from "../Footer";

const Home = () => {
  return (
    <>
      <Header />
      <div className="relative w-full h-[40vh] sm:h-[70vh] md:h-[90vh]">
        <img
          src={bgimg}
          className="w-full h-full object-cover object-center"
          alt="Hero"
        />
        <div className="w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-white text-xl sm:text-2xl md:text-7xl font-bold mt-0">
            Welcome to WHRISTORIUM
          </h1>
          <p className="text-sm sm:text-base md:text-2xl text-gray-300 mt-4">
            Your one-stop shop for the finest watches.
          </p>
        </div>
      </div>
      {/* item showcase */}
      <div className="border-b border-gray-800 bg-[#0F172A] py-7">
        <div className="p-4 max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-white">
            Featured Items
          </h2>
          <p className="text-[#B1976B] mt-2 text-center">
            Check out our latest collection!
          </p>

          <Collections />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
