import express from "express"
import FavoriteController from "../controller/FavoriteController.js"
import TokenVerify from "../middleware/TokenVerify.js"

const favoriteRoute = express.Router()
const favoriteInstance = new FavoriteController()

// All routes require authentication
favoriteRoute.use(TokenVerify)

// Get user's favorites
favoriteRoute.get("/", favoriteInstance.getUserFavorites)

// Add to favorites
favoriteRoute.post("/", favoriteInstance.addToFavorites)

// Toggle favorite
favoriteRoute.post("/toggle", favoriteInstance.toggleFavorite)

// Check if product is favorite
favoriteRoute.get("/check/:productId", favoriteInstance.isFavorite)

// Get favorites count
favoriteRoute.get("/count", favoriteInstance.getFavoritesCount)

// Remove from favorites
favoriteRoute.delete("/:productId", favoriteInstance.removeFromFavorites)

// Clear all favorites
favoriteRoute.delete("/", favoriteInstance.clearFavorites)

export default favoriteRoute
