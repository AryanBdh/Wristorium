"use client";

import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Button from "../ui/Button";
import { useCart } from "../context/CartContext";
import Header from "../Header";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useCart();

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#162337] text-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-gray-400" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-400 mb-8">
              Looks like you haven't added any timepieces to your cart yet.
            </p>
            <Link to="/shop">
              <Button className="bg-[#d4af37] hover:bg-[#b8973a] text-black rounded-none px-8 py-6">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-[#162337] text-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
            <p className="text-gray-400">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your
              cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#0f1420] rounded-lg p-6 flex gap-4"
                >
                  <img
                    src={
                      product.mainImage ||
                      product.images?.[0] ||
                      "https://via.placeholder.com/200x200"
                    }
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-400 mb-3 capitalize">
                      {product.collection} Collection
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.features?.slice(0, 2).map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs bg-[#1a1f2c] text-gray-300 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(product.id, product.quantity - 1)
                          }
                          className="p-1 bg-[#1a1f2c] hover:bg-[#2a2f3c] rounded transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">
                          {product.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(product.id, product.quantity + 1)
                          }
                          className="p-1 bg-[#1a1f2c] hover:bg-[#2a2f3c] rounded transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-[#d4af37]">
                          Rs.
                          {(product.price * product.quantity).toLocaleString()}
                        </div>
                        {product.quantity > 1 && (
                          <div className="text-sm text-gray-400">
                            Rs.{product.price.toLocaleString()} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-4">
                <Link to="/shop">
                  <Button
                    variant="outline"
                    className="border-gray-600 hover:bg-gray-800"
                  >
                    Continue Shopping
                  </Button>
                </Link>
                <Button
                  onClick={clearCart}
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-900/20"
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#0f1420] rounded-lg p-6 sticky top-8">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs.{getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Rs.{(getCartTotal() * 0.08).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-[#d4af37]">
                        Rs.{(getCartTotal() * 1.08).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-[#d4af37] hover:bg-[#b8973a] text-black rounded-none py-6 mb-4">
                  Proceed to Checkout
                </Button>

                <div className="text-center text-sm text-gray-400">
                  <p>30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
