import { Link } from "react-router-dom";
import { Search, ShoppingBag, Heart } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { useCart } from "./context/CartContext";
import { useFavorites } from "./context/FavouritesContext";
import CollectionDropdown from "./CollectionDropdown";
import UserDropdown from "./UserDropdown";

const Header = () => {
  const { getCartItemsCount } = useCart();
  const { getFavoritesCount } = useFavorites();

  const cartItemsCount = getCartItemsCount();
  const favoritesCount = getFavoritesCount();

  return (
    <>
      <header className="border-b border-gray-800 bg-[#0F172A] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-100">
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
            <Link to="/cart" className="relative" aria-label="Cart">
              <ShoppingBag className="h-5 w-5 text-gray-300 hover:text-[#d4af37] transition" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#d4af37] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </span>
              )}
            </Link>
            <Link to="/favorites" className="relative" aria-label="Favorites">
              <Heart className="h-5 w-5 text-gray-300 hover:text-[#d4af37] transition" />
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#d4af37] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {favoritesCount > 99 ? "99+" : favoritesCount}
                </span>
              )}
            </Link>
            <UserDropdown />
            <MobileMenu />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
