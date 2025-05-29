"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Check } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match", {
        id: "password-mismatch",
      });
      return false;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters", {
        id: "password-length",
      });
      return false;
    }

    if (!formData.agreeTerms) {
      toast.error("You must agree to the Terms of Service", {
        id: "terms-required",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // This is where you would integrate with your authentication system
      // For now, we'll just simulate a successful registration
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Registration successful! Welcome to WHRISTORIUM.", {
        icon: "✨",
        id: "register-success",
      });

      navigate("/");
    } catch (error) {
      toast.error("Registration failed. Please try again.", {
        id: "register-error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "" };

    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const isLongEnough = password.length >= 8;

    const criteria = [
      hasLowercase,
      hasUppercase,
      hasNumber,
      hasSpecial,
      isLongEnough,
    ];
    const metCriteria = criteria.filter(Boolean).length;

    if (metCriteria <= 2) return { strength: 1, label: "Weak" };
    if (metCriteria <= 4) return { strength: 2, label: "Medium" };
    return { strength: 3, label: "Strong" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <>
      <div className="bg-[#0a0e17] text-white min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-16 flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Link to="/" className="text-2xl font-bold inline-block">
                <span className="text-[#d4af37]">WHRIST</span>ORIUM
              </Link>
              <h1 className="text-3xl font-bold mt-6 mb-2">
                Create an Account
              </h1>
              <p className="text-gray-400">
                Join WHRISTORIUM to explore our exclusive timepieces
              </p>
            </div>

            <div className="bg-[#0f1420] rounded-lg p-8 shadow-lg border border-gray-800">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium"
                    >
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium"
                    >
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

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
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    Password
                  </label>
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
                      required
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

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="pl-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {formData.password && formData.confirmPassword && (
                    <div className="mt-1 flex items-center">
                      {formData.password === formData.confirmPassword ? (
                        <>
                          <Check className="h-3 w-3 text-green-400 mr-1" />
                          <span className="text-xs text-green-400">
                            Passwords match
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-red-400">
                          Passwords do not match
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeTerms"
                      name="agreeTerms"
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-600 bg-[#1a1f2c] text-[#d4af37] focus:ring-[#d4af37]"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreeTerms" className="text-gray-300">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-[#d4af37] hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-[#d4af37] hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#d4af37] hover:bg-[#b8973a] text-black rounded-none py-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <p className="text-gray-400">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#d4af37] hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
