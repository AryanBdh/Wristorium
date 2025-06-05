import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Footer = () => {
  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true,
    });
  }, []);

  return (
    <>
      <footer className=" mt-15 mb-0 pt-16  border-t border-gray-800 ">
        <div data-aos="fade-up" data-aos-once="true" className="max-w-7xl mx-auto">
          <div className=" grid grid-cols-1 md:grid-cols-4 gap-20 mb-12">
            <div>
              <Link to="/" className="text-xl font-bold text-white mb-6 block">
                <span className="text-[#B1976B]">WHRIST</span>ORIUM
              </Link>
              <p className="text-sm text-gray-400 mb-6">
                Crafting exceptional timepieces that blend traditional
                craftsmanship with innovative design.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    to="/mens-watches"
                    className="hover:text-[#B1976B] transition"
                  >
                    Men's Watches
                  </Link>
                </li>
                <li>
                  <Link
                    to="/womens-watches"
                    className="hover:text-[#B1976B] transition"
                  >
                    Women's Watches
                  </Link>
                </li>
                <li>
                  <Link
                    to="/smart-watches"
                    className="hover:text-[#B1976B] transition"
                  >
                    Smart Watches
                  </Link>
                </li>
                <li>
                  <Link
                    to="/accessories"
                    className="hover:text-[#B1976B] transition"
                  >
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">About</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    to="/our-story"
                    className="hover:text-[#B1976B] transition"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    to="/craftsmanship"
                    className="hover:text-[#B1976B] transition"
                  >
                    Craftsmanship
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sustainability"
                    className="hover:text-[#B1976B] transition"
                  >
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="hover:text-[#B1976B] transition"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-[#B1976B] transition"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faqs" className="hover:text-[#B1976B] transition">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shipping"
                    className="hover:text-[#B1976B] transition"
                  >
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link
                    to="/store-locator"
                    className="hover:text-[#B1976B] transition"
                  >
                    Store Locator
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>© 2025 CHRONOLUXE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
