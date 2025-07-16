import Cart from "../models/Cart.js"
import Product from "../models/Product.js"
import mongoose from "mongoose"

class CartController {
  // Get user's cart
  async getUserCart(req, res) {
    try {
      const userId = req.user.id

      let cart = await Cart.findOne({ userId }).populate("items.productId")

      if (!cart) {
        cart = new Cart({ userId, items: [] })
        await cart.save()
      }

      const processedItems = cart.items.map((item) => {
        if (item.productId) {
          return {
            _id: item._id,
            productId: item.productId._id,
            product: item.productId,
            quantity: item.quantity,
            addedAt: item.addedAt,
          }
        } else {
          return {
            _id: item._id,
            productId: item.productId,
            product: item.productSnapshot,
            quantity: item.quantity,
            addedAt: item.addedAt,
            isDeleted: true,
          }
        }
      })

      res.json({
        success: true,
        cart: {
          _id: cart._id,
          items: processedItems,
          totalItems: cart.totalItems,
          totalAmount: cart.totalAmount,
          lastUpdated: cart.lastUpdated,
        },
      })
    } catch (error) {
      console.error("Error fetching cart:", error)
      res.status(500).json({
        success: false,
        message: "Error fetching cart",
        error: error.message,
      })
    }
  }

  // Add item to cart
  async addToCart(req, res) {
    try {
      const userId = req.user.id
      const { productId, quantity = 1 } = req.body

      // Validate quantity
      if (quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be at least 1",
        })
      }

      // Check if product exists
      const product = await Product.findById(productId)
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        })
      }

      // Check stock
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Only ${product.stock} items available`,
        })
      }

      let cart = await Cart.findOne({ userId })
      if (!cart) {
        cart = new Cart({ userId, items: [] })
      }

      const existingItemIndex = cart.items.findIndex((item) => item.productId.toString() === productId)

      if (existingItemIndex > -1) {
        // Update quantity
        const newQuantity = cart.items[existingItemIndex].quantity + quantity
        if (newQuantity > product.stock) {
          return res.status(400).json({
            success: false,
            message: `Cannot add ${quantity} more. Maximum available: ${product.stock}`,
          })
        }
        cart.items[existingItemIndex].quantity = newQuantity
      } else {
        // Add new item
        cart.items.push({
          productId: new mongoose.Types.ObjectId(productId),
          quantity,
          productSnapshot: {
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            mainImage: product.mainImage,
            category: product.category,
            brand: product.brand,
            description: product.description,
            features: product.features,
            stock: product.stock,
          },
        })
      }

      await cart.save()
      console.log("Cart saved:", JSON.stringify(cart, null, 2));


      await cart.populate("items.productId")

      res.json({
        success: true,
        message: "Added to cart",
        cart: {
          _id: cart._id,
          items: cart.items.map((item) => ({
            _id: item._id,
            productId: item.productId._id,
            product: item.productId,
            quantity: item.quantity,
            addedAt: item.addedAt,
          })),
          totalItems: cart.totalItems,
          totalAmount: cart.totalAmount,
          lastUpdated: cart.lastUpdated,
        },
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      res.status(500).json({
        success: false,
        message: "Error adding to cart",
        error: error.message,
      })
    }
  }

  // Update cart item quantity
  async updateCartItem(req, res) {
    try {
      const userId = req.user.id
      const { productId, quantity } = req.body

      if (quantity < 0) {
        return res.status(400).json({
          success: false,
          message: "Quantity cannot be negative",
        })
      }

      const cart = await Cart.findOne({ userId })
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found",
        })
      }

      const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId)
      if (itemIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Item not found in cart",
        })
      }

      if (quantity === 0) {
        // Remove item
        cart.items.splice(itemIndex, 1)
      } else {
        // Check stock
        const product = await Product.findById(productId)
        if (product && quantity > product.stock) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock. Only ${product.stock} items available`,
          })
        }
        // Update quantity
        cart.items[itemIndex].quantity = quantity
      }

      await cart.save()
      await cart.populate("items.productId")

      res.json({
        success: true,
        message: quantity === 0 ? "Item removed from cart" : "Cart updated",
        cart: {
          _id: cart._id,
          items: cart.items.map((item) => ({
            _id: item._id,
            productId: item.productId._id,
            product: item.productId,
            quantity: item.quantity,
            addedAt: item.addedAt,
          })),
          totalItems: cart.totalItems,
          totalAmount: cart.totalAmount,
          lastUpdated: cart.lastUpdated,
        },
      })
    } catch (error) {
      console.error("Error updating cart:", error)
      res.status(500).json({
        success: false,
        message: "Error updating cart",
        error: error.message,
      })
    }
  }

  // Remove item from cart
  async removeFromCart(req, res) {
    try {
      const userId = req.user.id
      const { productId } = req.params

      const cart = await Cart.findOne({ userId })
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found",
        })
      }

      const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId)
      if (itemIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Item not found in cart",
        })
      }

      cart.items.splice(itemIndex, 1)
      await cart.save()
      await cart.populate("items.productId")

      res.json({
        success: true,
        message: "Item removed from cart",
        cart: {
          _id: cart._id,
          items: cart.items.map((item) => ({
            _id: item._id,
            productId: item.productId._id,
            product: item.productId,
            quantity: item.quantity,
            addedAt: item.addedAt,
          })),
          totalItems: cart.totalItems,
          totalAmount: cart.totalAmount,
          lastUpdated: cart.lastUpdated,
        },
      })
    } catch (error) {
      console.error("Error removing from cart:", error)
      res.status(500).json({
        success: false,
        message: "Error removing from cart",
        error: error.message,
      })
    }
  }

  // Clear cart
  async clearCart(req, res) {
    try {
      const userId = req.user.id

      const cart = await Cart.findOne({ userId })
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found",
        })
      }

      cart.items = []
      await cart.save()

      res.json({
        success: true,
        cart: {
          _id: cart._id,
          items: [],
          totalItems: 0,
          totalAmount: 0,
          lastUpdated: cart.lastUpdated,
        },
      })
    } catch (error) {
      console.error("Error clearing cart:", error)
      res.status(500).json({
        success: false,
        message: "Error clearing cart",
        error: error.message,
      })
    }
  }

  // Get cart count
  async getCartCount(req, res) {
    try {
      const userId = req.user.id

      const cart = await Cart.findOne({ userId })
      const count = cart ? cart.totalItems : 0

      res.json({
        success: true,
        count,
      })
    } catch (error) {
      console.error("Error getting cart count:", error)
      res.status(500).json({
        success: false,
        message: "Error getting cart count",
        error: error.message,
      })
    }
  }
}

export default CartController
