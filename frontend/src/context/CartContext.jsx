"use client";

import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const API_BASE_URL = "http://localhost:5000";

  const getAuthToken = () => localStorage.getItem("token");

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    if (isLoaded) return;
    setIsLoading(true);
    try {
      await loadCartFromDatabase();
    } catch (error) {
      console.error("❌ Error loading cart:", error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  };

  const loadCartFromDatabase = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.cart?.items) {
          const transformedItems = data.cart.items.map((item) => ({
            id: item.productId,
            _id: item.productId,
            name: item.product?.name || item.productSnapshot?.name,
            price: item.product?.price || item.productSnapshot?.price,
            mainImage:
              item.product?.mainImage || item.productSnapshot?.mainImage,
            quantity: item.quantity,
            product: item.product || item.productSnapshot,
          }));
          setCartItems(transformedItems);
        } else {
          setCartItems([]);
        }
      } else {
        throw new Error("Database request failed");
      }
    } catch (error) {
      console.error("Error loading cart from database:", error);
      throw error;
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      const productId = product._id || product.id;

      const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        await loadCartFromDatabase();
        toast.success("Item added to cart");
        return true;
      } else {
        toast.error(data.message || "Failed to add item to cart");
        return false;
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setIsLoading(true);
      const token = getAuthToken();

      const response = await fetch(
        `${API_BASE_URL}/api/cart/remove/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        await loadCartFromDatabase();
        toast.success("Item removed from cart");
        return true;
      } else {
        toast.error(data.message || "Failed to remove item");
        return false;
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      return await removeFromCart(productId);
    }

    try {
      setIsLoading(true);
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/api/cart/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        await loadCartFromDatabase();
        return true;
      } else {
        toast.error(data.message || "Failed to update quantity");
        return false;
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setCartItems([]); // Optimistically clear cart in UI

    try {
      setIsLoading(true);
      const token = getAuthToken();

      if (!token) return true;

      const response = await fetch(`${API_BASE_URL}/api/cart/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        return true;
      } else {
        toast.error(data.message || "Failed to clear cart");
        return false;
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetCartState = () => {
    setCartItems([]);
    setIsLoaded(false); // optional
  };

  // Helpers
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return cartItems.some((item) => (item._id || item.id) === productId);
  };

  const getCartItem = (productId) => {
    return cartItems.find((item) => (item._id || item.id) === productId);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isInCart,
    getCartItem,
    isLoading,
    isLoaded,
    resetCartState,
    loadCart, 
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
