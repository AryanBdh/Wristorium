"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // This is where you would integrate with your authentication system
      // For now, we'll just simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Login successful! Welcome back.", {
        icon: "👋",
        id: "login-success",
      });

      navigate("/");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.", {
        id: "login-error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[#0a0e17] text-white min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-16 flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Link to="/" className="text-2xl font-bold inline-block">
                <span className="text-[#d4af37]">WHRIST</span>ORIUM
              </Link>
              <h1 className="text-3xl font-bold mt-6 mb-2">Welcome Back</h1>
              <p className="text-gray-400">
                Sign in to your account to continue
              </p>
            </div>

            <div className="bg-[#0f1420] rounded-lg p-8 shadow-lg border border-gray-800">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="pl-10"
                      
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-[#d4af37] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="pl-10"
                      
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-600 bg-[#1a1f2c] text-[#d4af37] focus:ring-[#d4af37]"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 block text-sm text-gray-300"
                  >
                    Remember me
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#d4af37] hover:bg-[#b8973a] text-black rounded-none py-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <p className="text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-[#d4af37] hover:underline"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-500">
              <p>
                By signing in, you agree to our{" "}
                <Link to="/terms" className="text-gray-400 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-gray-400 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
