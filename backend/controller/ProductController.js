import fs from "fs"
import Product from "../models/Product.js"

class ProductController {
  async index(req, res) {
    try {
      const { category, sort, limit = 50, page = 1 } = req.query

      // Build query
      const query = {}
      if (category) query.category = category

      // Build sort options
      let sortOptions = {}
      if (sort) {
        switch (sort) {
          case "price-low":
            sortOptions = { price: 1 }
            break
          case "price-high":
            sortOptions = { price: -1 }
            break
          case "newest":
            sortOptions = { createdAt: -1 }
            break
          case "rating":
            sortOptions = { rating: -1 }
            break
          case "name":
            sortOptions = { name: 1 }
            break
          default:
            sortOptions = { createdAt: -1 } // Default sort by newest
        }
      } else {
        sortOptions = { createdAt: -1 } // Default sort by newest
      }

      // Calculate pagination
      const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

      // Execute query
      const products = await Product.find(query).sort(sortOptions).skip(skip).limit(Number.parseInt(limit))

      // Get total count for pagination
      const total = await Product.countDocuments(query)

      return res.status(200).json({
        products,
        pagination: {
          total,
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          pages: Math.ceil(total / Number.parseInt(limit)),
        },
      })
    } catch (error) {
      console.error("Error fetching products:", error)
      return res.status(500).json({ error: "Failed to fetch products" })
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params
      const product = await Product.findById(id)

      if (!product) {
        return res.status(404).json({ error: "Product not found" })
      }

      return res.status(200).json(product)
    } catch (error) {
      console.error("Error fetching product:", error)
      return res.status(500).json({ error: "Failed to fetch product" })
    }
  }

  async store(req, res) {
    try {
      console.log("Creating new product:", req.body)

      // Handle image files
      const images = []
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          images.push(file.filename)
        })
      }

      // Create product with images
      const productData = {
        ...req.body,
        images,
        mainImage: images.length > 0 ? images[0] : null,
      }

      // Parse numeric fields
      if (req.body.price) productData.price = Number.parseFloat(req.body.price)
      if (req.body.originalPrice) productData.originalPrice = Number.parseFloat(req.body.originalPrice)
      if (req.body.stock) productData.stock = Number.parseInt(req.body.stock)
      if (req.body.weight) productData.weight = Number.parseFloat(req.body.weight)

      // Parse boolean fields
      productData.isNew = req.body.isNew === "true" || req.body.isNew === true
      productData.isSale = req.body.isSale === "true" || req.body.isSale === true

      // Parse JSON fields if they come as strings
      if (req.body.features && typeof req.body.features === "string") {
        try {
          productData.features = JSON.parse(req.body.features)
        } catch (e) {
          productData.features = [req.body.features]
        }
      }

      if (req.body.dimensions && typeof req.body.dimensions === "string") {
        try {
          productData.dimensions = JSON.parse(req.body.dimensions)
        } catch (e) {
          productData.dimensions = {}
        }
      }

      if (req.body.materials && typeof req.body.materials === "string") {
        try {
          productData.materials = JSON.parse(req.body.materials)
        } catch (e) {
          productData.materials = {}
        }
      }

      if (req.body.specifications && typeof req.body.specifications === "string") {
        try {
          productData.specifications = JSON.parse(req.body.specifications)
        } catch (e) {
          productData.specifications = {}
        }
      }

      const product = new Product(productData)
      await product.save()

      return res.status(201).json({
        status: true,
        message: "Product created successfully!",
        product,
      })
    } catch (error) {
      console.error("Error creating product:", error)
      return res.status(500).json({
        status: false,
        message: "Failed to create product",
        error: error.message,
      })
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const updateData = { ...req.body }

      // Handle image uploads if present
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map((file) => file.filename)

        // Get existing product to check for images to delete
        const existingProduct = await Product.findById(id)
        if (existingProduct) {
          // If we're replacing all images, delete old ones
          if (req.body.replaceAllImages === "true") {
            existingProduct.images.forEach((image) => {
              if (!image.startsWith("http")) {
                const imagePath = `public/products/${image}`
                if (fs.existsSync(imagePath)) {
                  fs.unlinkSync(imagePath)
                }
              }
            })
            updateData.images = newImages
          } else {
            // Append new images to existing ones
            updateData.images = [...existingProduct.images, ...newImages]
          }

          // Update main image if specified
          if (req.body.mainImageIndex !== undefined) {
            const index = Number.parseInt(req.body.mainImageIndex)
            if (index >= 0 && index < updateData.images.length) {
              updateData.mainImage = updateData.images[index]
            }
          } else if (newImages.length > 0 && !existingProduct.mainImage) {
            updateData.mainImage = newImages[0]
          }
        }
      }

      // Parse numeric fields
      if (req.body.price) updateData.price = Number.parseFloat(req.body.price)
      if (req.body.originalPrice) updateData.originalPrice = Number.parseFloat(req.body.originalPrice)
      if (req.body.stock) updateData.stock = Number.parseInt(req.body.stock)
      if (req.body.weight) updateData.weight = Number.parseFloat(req.body.weight)

      // Parse boolean fields
      if (req.body.isNew !== undefined) {
        updateData.isNew = req.body.isNew === "true" || req.body.isNew === true
      }
      if (req.body.isSale !== undefined) {
        updateData.isSale = req.body.isSale === "true" || req.body.isSale === true
      }

      // Parse JSON fields if they come as strings
      if (req.body.features && typeof req.body.features === "string") {
        try {
          updateData.features = JSON.parse(req.body.features)
        } catch (e) {
          updateData.features = [req.body.features]
        }
      }

      if (req.body.dimensions && typeof req.body.dimensions === "string") {
        try {
          updateData.dimensions = JSON.parse(req.body.dimensions)
        } catch (e) {
          updateData.dimensions = {}
        }
      }

      if (req.body.materials && typeof req.body.materials === "string") {
        try {
          updateData.materials = JSON.parse(req.body.materials)
        } catch (e) {
          updateData.materials = {}
        }
      }

      if (req.body.specifications && typeof req.body.specifications === "string") {
        try {
          updateData.specifications = JSON.parse(req.body.specifications)
        } catch (e) {
          updateData.specifications = {}
        }
      }

      const product = await Product.findByIdAndUpdate(id, updateData, { new: true })

      if (!product) {
        return res.status(404).json({ error: "Product not found" })
      }

      return res.status(200).json({
        status: true,
        message: "Product updated successfully!",
        product,
      })
    } catch (error) {
      console.error("Error updating product:", error)
      return res.status(500).json({
        status: false,
        message: "Failed to update product",
        error: error.message,
      })
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params

      // Find product to get image paths
      const product = await Product.findById(id)

      if (!product) {
        return res.status(404).json({ error: "Product not found" })
      }

      // Delete associated images
      if (product.images && product.images.length > 0) {
        product.images.forEach((image) => {
          if (!image.startsWith("http")) {
            const imagePath = `public/products/${image}`
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath)
            }
          }
        })
      }

      // Delete the product
      await Product.findByIdAndDelete(id)

      return res.status(200).json({
        status: true,
        message: "Product deleted successfully!",
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      return res.status(500).json({
        status: false,
        message: "Failed to delete product",
        error: error.message,
      })
    }
  }

  async getStats(req, res) {
    try {
      // Get total products count
      const totalProducts = await Product.countDocuments()

      // Get low stock products count (less than 5)
      const lowStockProducts = await Product.countDocuments({ stock: { $lt: 5 } })

      // Get out of stock products count
      const outOfStockProducts = await Product.countDocuments({ stock: 0 })

      // Get products by category
      const productsByCategory = await Product.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
      ])

      // Format category data
      const categories = {}
      productsByCategory.forEach((item) => {
        categories[item._id] = item.count
      })

      return res.status(200).json({
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        categories,
      })
    } catch (error) {
      console.error("Error fetching product stats:", error)
      return res.status(500).json({ error: "Failed to fetch product statistics" })
    }
  }

  async removeImage(req, res) {
    try {
      const { id, imageIndex } = req.params
      const index = Number.parseInt(imageIndex)

      const product = await Product.findById(id)

      if (!product) {
        return res.status(404).json({ error: "Product not found" })
      }

      if (index < 0 || index >= product.images.length) {
        return res.status(400).json({ error: "Invalid image index" })
      }

      // Get the image to remove
      const imageToRemove = product.images[index]

      // Delete the image file if it's not a URL
      if (!imageToRemove.startsWith("http")) {
        const imagePath = `public/products/${imageToRemove}`
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
      }

      // Remove the image from the array
      product.images.splice(index, 1)

      // If the main image was removed, set a new one
      if (product.mainImage === imageToRemove && product.images.length > 0) {
        product.mainImage = product.images[0]
      } else if (product.images.length === 0) {
        product.mainImage = null
      }

      await product.save()

      return res.status(200).json({
        status: true,
        message: "Image removed successfully!",
        product,
      })
    } catch (error) {
      console.error("Error removing image:", error)
      return res.status(500).json({
        status: false,
        message: "Failed to remove image",
        error: error.message,
      })
    }
  }
}

export default ProductController
