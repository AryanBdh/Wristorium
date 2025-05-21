import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const CollectionDropdown = () => {
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
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="hover:text-[#B1976B] transition cursor-pointer"
      >
        Collections
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-4 bg-[#162337] shadow-lg rounded-md z-40">
          <ul className="py-2 w-48">
            <li>
              <Link
                to="/collections/men"
                className="block px-4 py-2 hover:text-[#B1976B] transition cursor-pointer"
                onClick={() => setIsOpen(false)} // Close after selecting
              >
                Men's Collection
              </Link>
            </li>
            <li>
              <Link
                to="/collections/women"
                className="block px-4 py-2 hover:text-[#B1976B] transition cursor-pointer"
                onClick={() => setIsOpen(false)} // Close after selecting
              >
                Women's Collection
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CollectionDropdown;
