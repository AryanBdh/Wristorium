import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate login
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center justify-between space-x-4 md:space-x-6">
        <button
          aria-label="Account"
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
        >
          <User className="h-5 w-5 text-gray-300 hover:text-[#B1976B] transition cursor-pointer" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-[#162337] shadow-lg rounded-md py-2 z-50">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 text-sm text-gray-100 hover:text-[#B1976B] transition cursor-pointer"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 text-sm text-gray-100 hover:text-[#B1976B] transition cursor-pointer"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-100 hover:text-[#B1976B] transition cursor-pointer"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  setIsLoggedIn(false); // Log out
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-100 hover:text-[#B1976B] transition cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
