import express from "express"
import CartController from "../controller/CartController.js"
import TokenVerify from "../middleware/TokenVerify.js"

const cartRoute = express.Router()
const cartInstance = new CartController()

// All routes require authentication
cartRoute.use(TokenVerify)

// Get user's cart
cartRoute.get("/", cartInstance.getUserCart)

// Add to cart
cartRoute.post("/", cartInstance.addToCart)

// Update cart item quantity
cartRoute.put("/:productId", cartInstance.updateCartItem)

// Remove from cart
cartRoute.delete("/:productId", cartInstance.removeFromCart)

// Clear cart
cartRoute.delete("/", cartInstance.clearCart)

// Get cart count
cartRoute.get("/count", cartInstance.getCartCount)

export default cartRoute
