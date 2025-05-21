import Header from "../Header";
import Collections from "../Collections";
import Footer from "../Footer";
import Newsletter from "../Newsletter";
import Banner from "../Banner";

const Home = () => {
  return (
    <>
      <Header />
      <Banner />
      <div className="border-b border-gray-800 bg-[#162337] py-7">
        <div className="p-4 max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-white">
            Featured Items
          </h2>
          <p className="text-[#B1976B] mt-2 text-center">
            Check out our latest collection!
          </p>
          <Collections />
        </div>
      </div>
      <Newsletter />
      <Footer />
    </>
  );
};

export default Home;
