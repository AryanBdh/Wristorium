"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

const Checkout = () => {
  const { cartItems, getCartTotal, isLoaded } = useCart(); // Use proper cart context
  const [user, setUser] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("eSewa");
  const [loading, setLoading] = useState(false);

  

  // Payment method options with images
  const paymentMethods = [
    {
      id: "eSewa",
      name: "eSewa",
      image: "src/images/esewa-logo.jpg",
      description: "Pay with eSewa digital wallet",
    },
    {
      id: "cash_on_delivery",
      name: "Cash on Delivery",
      image: "src/images/cod-logo.jpg",
      description: "Pay when you receive your order",
    },
  ];

  const selectedMethod = paymentMethods.find((m) => m.id === paymentMethod);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    if (userData?.addresses?.length > 0) {
      setSelectedAddress(
        userData.addresses.find((a) => a.isDefault) || userData.addresses[0]
      );
    }
  }, []);

  const handlePlaceOrder = async () => {
    if (!isLoaded) {
      toast.error("Cart is still loading. Please wait.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a shipping address.");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to place an order.");
      return;
    }

    setLoading(true);

    const orderData = {
      userId: user._id,
      products: cartItems.map((item) => ({
        productId: item._id || item.id,
        quantity: item.quantity,
      })),
      shippingAddress: selectedAddress,
      paymentMethod,
      notes: `Order placed via ${
        paymentMethods.find((p) => p.id === paymentMethod)?.name
      }`,
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Order failed");
      }

      toast.success("Order placed successfully!");
      // Redirect to order confirmation or clear cart
      window.location.href = `/orders/${data.order._id}`;
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-white">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-400 mb-6">
            Add some items to your cart before checkout
          </p>
          <Button
            onClick={() => (window.location.href = "/shop")}
            className="bg-[#d4af37] text-black hover:bg-[#b8973a]"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#162337] text-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            <div className="flex items-center gap-4">
              <Link to="/cart">
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-800"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Cart
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Address and Payment */}
            <div className="space-y-6">
              {/* Address Selection */}
              <div className="bg-[#0f1420] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                {user?.addresses && user.addresses.length > 0 ? (
                  <div className="space-y-3">
                    {user.addresses.map((address, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedAddress === address
                            ? "border-[#d4af37] bg-[#1a1f2c] ring-1 ring-[#d4af37]"
                            : "border-gray-700 bg-[#121826] hover:border-gray-600"
                        }`}
                        onClick={() => setSelectedAddress(address)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">
                              {address.name}
                            </h4>
                            <p className="text-sm text-gray-400 mt-1">
                              {address.street}
                            </p>
                            <p className="text-sm text-gray-400">
                              {address.city}, {address.district}{" "}
                              {address.zipCode}
                            </p>
                            <p className="text-sm text-gray-400">
                              {address.country}
                            </p>
                            {address.phone && (
                              <p className="text-sm text-gray-400 mt-1">
                                Phone: {address.phone}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {address.isDefault && (
                              <span className="text-xs bg-[#d4af37] text-black px-2 py-1 rounded font-medium">
                                Default
                              </span>
                            )}
                            {selectedAddress === address && (
                              <div className="w-4 h-4 rounded-full bg-[#d4af37] flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-black"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">No addresses found</p>
                    <Button
                      onClick={() => (window.location.href = "/profile")}
                      className="bg-[#d4af37] text-black hover:bg-[#b8973a]"
                    >
                      Add Address
                    </Button>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-[#0f1420] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="grid grid-cols-1 gap-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? "border-[#d4af37] bg-[#1a1f2c] ring-1 ring-[#d4af37]"
                          : "border-gray-700 bg-[#121826] hover:border-gray-600"
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                          <img
                            src={method.image || "/placeholder.svg"}
                            alt={method.name}
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                              // Fallback to text if image fails to load
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">
                            {method.name}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {method.description}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {paymentMethod === method.id && (
                            <div className="w-4 h-4 rounded-full bg-[#d4af37] flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-black"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <div className="bg-[#0f1420] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item, index) => (
                    <div
                      key={item._id || item.id || index}
                      className="flex items-center gap-4 p-3 bg-[#121826] rounded-lg"
                    >
                      <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={
                            item.image ||
                            item.mainImage ||
                            "/placeholder.svg?height=64&width=64"
                          }
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "/placeholder.svg?height=64&width=64";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-400">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm text-[#d4af37] font-semibold">
                          Rs. {(item.price || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#d4af37]">
                          Rs.{" "}
                          {((item.price || 0) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="border-t border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-white">
                      Rs. {getCartTotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping:</span>
                    <span className="text-white">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax:</span>
                    <span>Rs.{(getCartTotal() * 0.13).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-white">Total:</span>
                      <span className="text-[#d4af37]">
                        Rs. {(getCartTotal()* 1.13).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handlePlaceOrder}
                  disabled={
                    loading || !selectedAddress || cartItems.length === 0
                  }
                  className="w-full mt-6 bg-[#d4af37] text-black hover:bg-[#b8973a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedMethod ? `Pay with ${selectedMethod.name}` : "Select Payment Method"}
                </Button>

                {/* Order Info */}
                <div className="mt-4 p-3 bg-[#121826] rounded-lg">
                  <p className="text-xs text-gray-400 text-center">
                    By placing this order, you agree to our Terms of Service and
                    Privacy Policy. You will receive an order confirmation email
                    shortly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
