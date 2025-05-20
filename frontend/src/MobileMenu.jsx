"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import  Button  from "./ui/Button"

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    // Prevent scrolling when menu is open
    if (!isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }

  const closeMenu = () => {
    setIsOpen(false)
    document.body.style.overflow = "auto"
  }

  const menuItems = [
    { name: "Shop", href: "/shop" },
    { name: "Collections", href: "/collections" },
    { name: "Best Sellers", href: "/best-sellers" },
    { name: "Men", href: "/men" },
    { name: "Women", href: "/women" },
    { name: "Smart", href: "/smart" },
  ]

  const collections = [
    { name: "Heritage Collection", href: "/collections/heritage" },
    { name: "Minimalist Collection", href: "/collections/minimalist" },
    { name: "Innovation Collection", href: "/collections/innovation" },
    { name: "Grandeur Collection", href: "/collections/grandeur" },
  ]

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="mt-2 text-gray-300 hover:text-[#d4af37] transition"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeMenu} />}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 w-[85%] sm:w-[350px] h-full bg-[#0a0e17] border-l border-gray-800 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between py-4 px-4 border-b border-gray-800">
            <Link to="/" className="text-xl font-bold text-white" onClick={closeMenu}>
              <span className="text-[#d4af37]">CHRONO</span>LUXE
            </Link>
            <button
              onClick={closeMenu}
              className="p-2 text-gray-300 hover:text-[#d4af37] transition"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-auto py-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold px-4">Main Menu</h3>
                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="block py-2 px-4 text-base hover:bg-[#1a1f2c] transition-colors"
                        onClick={closeMenu}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold px-4">Collections</h3>
                <ul className="space-y-1">
                  {collections.map((collection) => (
                    <li key={collection.name}>
                      <Link
                        to={collection.href}
                        className="block py-2 px-4 text-base hover:bg-[#1a1f2c] transition-colors"
                        onClick={closeMenu}
                      >
                        {collection.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold px-4">Account</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/account/login"
                      className="block py-2 px-4 text-base hover:bg-[#1a1f2c] transition-colors"
                      onClick={closeMenu}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/account/register"
                      className="block py-2 px-4 text-base hover:bg-[#1a1f2c] transition-colors"
                      onClick={closeMenu}
                    >
                      Register
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cart"
                      className="block py-2 px-4 text-base hover:bg-[#1a1f2c] transition-colors"
                      onClick={closeMenu}
                    >
                      Cart
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          <div className="border-t border-gray-800 py-4 px-4">
            <Button className="w-full bg-[#d4af37] hover:bg-[#b8973a] text-black">Shop Now</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
