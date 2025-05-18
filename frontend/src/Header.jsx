import { Link } from "react-router-dom"
import { Search, ShoppingBag, User, Heart } from "lucide-react"
import MobileMenu from "./MobileMenu"

const Header = () => {
  return (
    <>
    <header className="border-b border-gray-800 bg-[#0F172A] sticky top-0 z-50">
      <div className="w-[95%] mx-auto py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-xl font-bold text-white">
            <span className="text-[#d4af37]">WHRIST</span>ORIUM
          </Link>
          <nav className="hidden md:flex space-x-6 text-sm">
            <Link to="/shop" className="hover:text-[#d4af37] transition">
              Shop
            </Link>
            <Link to="/collections" className="hover:text-[#d4af37] transition">
              Collections
            </Link>
            <Link to="/best-sellers" className="hover:text-[#d4af37] transition">
              Best Sellers
            </Link>
            <Link to="/men" className="hover:text-[#d4af37] transition">
              Men
            </Link>
            <Link to="/women" className="hover:text-[#d4af37] transition">
              Women
            </Link>
            <Link to="/smart" className="hover:text-[#d4af37] transition">
              Smart
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button aria-label="Search">
            <Search className="h-5 w-5 text-gray-300 hover:text-[#d4af37] transition cursor-pointer" />
          </button>
          <button aria-label="Cart">
            <ShoppingBag className="h-5 w-5 text-gray-300 hover:text-[#d4af37] transition cursor-pointer" />
          </button>
          <button aria-label="Favourite">
            <Heart className="h-5 w-5 text-gray-300 hover:text-[#d4af37] transition cursor-pointer" />
          </button>
          <button aria-label="Account">
            <User className="h-5 w-5 text-gray-300 hover:text-[#d4af37] transition cursor-pointer" />
          </button>
          <MobileMenu />
        </div>
      </div>
    </header>
    </>
  )
}

export default Header
