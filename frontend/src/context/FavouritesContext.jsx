"use client"

import { createContext, useContext, useState, useEffect } from "react"
import toast from "react-hot-toast"

const FavoritesContext = createContext()

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("whristorium-favorites")
      if (savedFavorites) {
        setFavoriteIds(JSON.parse(savedFavorites))
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error)
      setFavoriteIds([])
    }
  }, [])

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("whristorium-favorites", JSON.stringify(favoriteIds))
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error)
    }
  }, [favoriteIds])

  // Add item to favorites
  const addToFavorites = (productId) => {
    setFavoriteIds((prevIds) => {
      if (!prevIds.includes(productId)) {
        toast.success("Item added to favorites",{
          id: `favorite-add-${productId}`,
        })
        return [...prevIds, productId]
      }
      return prevIds
    })
  }

  // Remove item from favorites
  const removeFromFavorites = (productId) => {
    toast.success("Item removed from favorites")
    setFavoriteIds((prevIds) => prevIds.filter((id) => id !== productId))
  }

  // Toggle favorite status
  const toggleFavorite = (productId) => {
    if (favoriteIds.includes(productId)) {
      removeFromFavorites(productId)
    } else {
      addToFavorites(productId)
    }
  }

  // Check if item is favorite
  const isFavorite = (productId) => {
    return favoriteIds.includes(productId)
  }

  // Get number of favorites
  const getFavoritesCount = () => {
    return favoriteIds.length
  }

  const value = {
    favoriteIds,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoritesCount,
  }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
