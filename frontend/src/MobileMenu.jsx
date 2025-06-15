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
    { name: "Men", href: "/collections/men" },
    { name: "Women", href: "/collections/women" },
    { name: "Smart", href: "/collections/smart" },
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
              <span className="text-[#d4af37]">WHRIST</span>ORIUM
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
                <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold px-4">Account</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/login"
                      className="block py-2 px-4 text-base hover:bg-[#1a1f2c] transition-colors"
                      onClick={closeMenu}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
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

        </div>
      </div>
    </div>
  )
}

export default MobileMenu
