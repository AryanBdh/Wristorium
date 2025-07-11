import express from "express"
import CartController from "../controller/CartController.js"
import RouteMiddleware from "../middleware/RouteMiddleware.js"

const cartRoute = express.Router()
const cartInstance = new CartController()
const auth = new RouteMiddleware()

// All routes require authentication
cartRoute.use(auth.check)

// Get user's cart
cartRoute.get("/", cartInstance.getUserCart)

// Add to cart
cartRoute.post("/add", cartInstance.addToCart)

// Update cart item quantity
cartRoute.put("/update", cartInstance.updateCartItem)

// Remove from cart
cartRoute.delete("/remove/:productId", cartInstance.removeFromCart)

// Clear cart
cartRoute.delete("/clear", cartInstance.clearCart)

// Get cart count
cartRoute.get("/count", cartInstance.getCartCount)

export default cartRoute
