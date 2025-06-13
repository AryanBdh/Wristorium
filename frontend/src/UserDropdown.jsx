"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, Heart, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Check authentication status
  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  // Check auth status on component mount and when localStorage changes
  useEffect(() => {
    checkAuthStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Update state
    setUser(null);
    setIsOpen(false);

    // Show success message
    toast.success("Logged out successfully", {
      icon: "👋",
      duration: 3000,
    });

    // Redirect to home page
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";


  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center justify-between space-x-4 md:space-x-6">
          <button
            aria-label="Account"
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            {isLoggedIn ? (
            // Logged in user - show avatar with initials or profile image
            <div className="w-8 h-8 bg-[#B1976B] rounded-full flex items-center justify-center text-black font-semibold text-sm hover:bg-[#b8973a] transition-colors overflow-hidden">
              {user.image ? (
                <img
                  src={user.image || "/placeholder.svg"}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.style.display = "none"
                    e.target.parentNode.textContent = getInitials(user.name)
                  }}
                />
              ) : (
                getInitials(user.name)
              )}
            </div>
          ) : (
              // Not logged in - show user icon
              <User className="h-5 w-5 text-gray-300 hover:text-[#d4af37] transition cursor-pointer" />
            )}
          </button>
        </div>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[#0f1420] border border-gray-800 shadow-lg rounded-md py-2 z-50">
            {!isLoggedIn ? (
              // Not logged in - show login/register options
              <>
                <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-800">
                  Welcome to WHRISTORIUM
                </div>
                <Link
                  to="/login"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-100 hover:text-[#d4af37] hover:bg-[#1a1f2c] transition cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-100 hover:text-[#d4af37] hover:bg-[#1a1f2c] transition cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Create Account
                </Link>
              </>
            ) : (
              // Logged in - show user menu
              <>
                <div className="px-4 py-2 border-b border-gray-800">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                  {isAdmin && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-[#d4af37]/20 text-[#d4af37] text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </div>

                {isAdmin && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-[#d4af37] hover:bg-[#1a1f2c] transition cursor-pointer"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <rect width="7" height="9" x="3" y="3" rx="1" />
                        <rect width="7" height="5" x="14" y="3" rx="1" />
                        <rect width="7" height="9" x="14" y="12" rx="1" />
                        <rect width="7" height="5" x="3" y="16" rx="1" />
                      </svg>
                      Admin Dashboard
                    </Link>
                  </>
                )}

                <div className="border-t border-gray-800 mt-1 pt-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-100 hover:text-[#d4af37] hover:bg-[#1a1f2c] transition cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-[#1a1f2c] transition cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default UserDropdown;
