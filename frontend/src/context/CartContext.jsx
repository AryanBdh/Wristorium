"use client"

import { createContext, useContext, useState, useEffect } from "react"
import toast from "react-hot-toast"

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("chronoluxe-cart")
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
      setCartItems([])
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("chronoluxe-cart", JSON.stringify(cartItems))
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  }, [cartItems])

  // Add item to cart
   const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        // If item exists, increase quantity
        toast.success(`Increased quantity in cart`,{
          id: `cart-update-${product.id}`,
        })
        return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        // If new item, add with quantity 1
        toast.success(`Item added to cart`,{
          id: `cart-add-${product.id}`,
        })
        return [...prevItems, { ...product, quantity: 1 }]
      }
    })
  }

  // Remove item from cart completely
  const removeFromCart = (productId) => {
    const item = cartItems.find((item) => item.id === productId)
    if (item) {
      toast.success(`Item removed from cart`)
    }
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)),
      )
    }
  }

  // Clear entire cart
  const clearCart = () => {
    setCartItems([])
  }

  // Get total price
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Get total number of items
  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
