import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      <button aria-label="Account"
        onClick={() => setIsOpen((prev) => !prev)}
        className="hover:text-[#B1976B] transition cursor-pointer"
      >
        <User className="h-5 w-5 text-gray-300 hover:text-[#B1976B] transition cursor-pointer" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-4 bg-[#162337] shadow-lg rounded-md z-40">
          <ul className="py-2 w-48">
            <li>
              <Link
                to="/login"
                className="block px-4 py-2 hover:text-[#B1976B] transition cursor-pointer"
                onClick={() => setIsOpen(false)} // Close after selecting
              >
                Sign In
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="block px-4 py-2 hover:text-[#B1976B] transition cursor-pointer"
                onClick={() => setIsOpen(false)} // Close after selecting
              >
                Register
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
