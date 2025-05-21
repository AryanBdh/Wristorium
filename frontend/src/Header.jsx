import { Link } from "react-router-dom";
import { Search, ShoppingBag, User, Heart } from "lucide-react";
import MobileMenu from "./MobileMenu";
import CollectionDropdown from "./CollectionDropdown";

const Header = () => {
  return (
    <>
      <header className="border-b border-gray-800 bg-[#0F172A] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-white">
              <span className="text-[#B1976B]">WHRIST</span>ORIUM
            </Link>
            <nav className="hidden md:flex space-x-6 text-sm">
              <Link to="/shop" className="hover:text-[#B1976B] transition">
                Shop
              </Link>
              <Link to="/about" className="hover:text-[#B1976B] transition">
                About
              </Link>
              <CollectionDropdown />
              <Link to="/contact" className="hover:text-[#B1976B] transition">
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex items-center justify-between space-x-4 md:space-x-6">
            <button aria-label="Search">
              <Search className="h-5 w-5 text-gray-300 hover:text-[#B1976B] transition cursor-pointer" />
            </button>
            <Link to="/cart" aria-label="Cart">
              <ShoppingBag className="h-5 w-5 text-gray-300 hover:text-[#B1976B] transition cursor-pointer" />
            </Link>
            <Link to="/favourite" aria-label="Favourite">
              <Heart className="h-5 w-5 text-gray-300 hover:text-[#B1976B] transition cursor-pointer" />
            </Link>
            <button aria-label="Account">
              <User className="h-5 w-5 text-gray-300 hover:text-[#B1976B] transition cursor-pointer" />
            </button>
            <MobileMenu />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
