import Favorite from "../models/Favorite.js"
import Product from "../models/Product.js"

class FavoriteController {
  // Get user's favorites
  async getUserFavorites(req, res) {
    try {
      const userId = req.user.id

      const favorites = await Favorite.find({ userId }).populate("productId").sort({ createdAt: -1 })

      // Filter out favorites where product no longer exists and use snapshot
      const validFavorites = favorites.map((fav) => {
        if (fav.productId) {
          return {
            _id: fav._id,
            product: fav.productId,
            createdAt: fav.createdAt,
          }
        } else {
          // Product deleted, use snapshot
          return {
            _id: fav._id,
            product: fav.productSnapshot,
            createdAt: fav.createdAt,
            isDeleted: true,
          }
        }
      })

      res.json({
        success: true,
        favorites: validFavorites,
        count: validFavorites.length,
      })
    } catch (error) {
      console.error("Error fetching favorites:", error)
      res.status(500).json({
        success: false,
        message: "Error fetching favorites",
        error: error.message,
      })
    }
  }

  // Add to favorites
  async addToFavorites(req, res) {
    try {
      const userId = req.user.id
      const { productId } = req.body

      // Check if product exists
      const product = await Product.findById(productId)
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        })
      }

      // Check if already in favorites
      const existingFavorite = await Favorite.findOne({ userId, productId })
      if (existingFavorite) {
        return res.status(400).json({
          success: false,
          message: "Product already in favorites",
        })
      }

      // Create favorite with product snapshot
      const favorite = new Favorite({
        userId,
        productId,
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
          rating: product.rating,
          reviews: product.reviews,
          isNewProduct: product.isNewProduct,
          isSale: product.isSale,
        },
      })

      await favorite.save()

      res.json({
        success: true,
        message: "Added to favorites",
        favorite,
      })
    } catch (error) {
      console.error("Error adding to favorites:", error)
      res.status(500).json({
        success: false,
        message: "Error adding to favorites",
        error: error.message,
      })
    }
  }

  // Remove from favorites
  async removeFromFavorites(req, res) {
    try {
      const userId = req.user.id
      const { productId } = req.params

      const result = await Favorite.findOneAndDelete({ userId, productId })

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Favorite not found",
        })
      }

      res.json({
        success: true,
        message: "Removed from favorites",
      })
    } catch (error) {
      console.error("Error removing from favorites:", error)
      res.status(500).json({
        success: false,
        message: "Error removing from favorites",
        error: error.message,
      })
    }
  }

  // Toggle favorite
  async toggleFavorite(req, res) {
    try {
      const userId = req.user.id
      const { productId } = req.body

      const existingFavorite = await Favorite.findOne({ userId, productId })

      if (existingFavorite) {
        // Remove from favorites
        await Favorite.findOneAndDelete({ userId, productId })
        res.json({
          success: true,
          action: "removed",
          message: "Removed from favorites",
        })
      } else {
        // Add to favorites
        const product = await Product.findById(productId)
        if (!product) {
          return res.status(404).json({
            success: false,
            message: "Product not found",
          })
        }

        const favorite = new Favorite({
          userId,
          productId,
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
            rating: product.rating,
            reviews: product.reviews,
            isNewProduct: product.isNewProduct,
            isSale: product.isSale,
          },
        })

        await favorite.save()

        res.json({
          success: true,
          action: "added",
          message: "Added to favorites",
          favorite,
        })
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      res.status(500).json({
        success: false,
        message: "Error updating favorites",
        error: error.message,
      })
    }
  }

  // Check if product is favorited
  async isFavorite(req, res) {
    try {
      const userId = req.user.id
      const { productId } = req.params

      const favorite = await Favorite.findOne({ userId, productId })

      res.json({
        success: true,
        isFavorite: !!favorite,
      })
    } catch (error) {
      console.error("Error checking favorite status:", error)
      res.status(500).json({
        success: false,
        message: "Error checking favorite status",
        error: error.message,
      })
    }
  }

  // Clear all favorites
  async clearFavorites(req, res) {
    try {
      const userId = req.user.id

      const result = await Favorite.deleteMany({ userId })

      res.json({
        success: true,
        message: `Cleared ${result.deletedCount} favorites`,
        deletedCount: result.deletedCount,
      })
    } catch (error) {
      console.error("Error clearing favorites:", error)
      res.status(500).json({
        success: false,
        message: "Error clearing favorites",
        error: error.message,
      })
    }
  }

  // Get favorites count
  async getFavoritesCount(req, res) {
    try {
      const userId = req.user.id
      const count = await Favorite.countDocuments({ userId })

      res.json({
        success: true,
        count,
      })
    } catch (error) {
      console.error("Error getting favorites count:", error)
      res.status(500).json({
        success: false,
        message: "Error getting favorites count",
        error: error.message,
      })
    }
  }
}

export default FavoriteController
