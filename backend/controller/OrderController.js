import Order from "../models/Order.js"
import User from "../models/User.js"
import Product from "../models/Product.js"

class OrderController {
  async index(req, res) {
    try {
      const { status, sort, limit = 50, page = 1 } = req.query

      // Build query
      const query = {}
      if (status) query.status = status

      // Build sort options
      let sortOptions = {}
      if (sort) {
        switch (sort) {
          case "newest":
            sortOptions = { createdAt: -1 }
            break
          case "oldest":
            sortOptions = { createdAt: 1 }
            break
          case "amount-high":
            sortOptions = { totalAmount: -1 }
            break
          case "amount-low":
            sortOptions = { totalAmount: 1 }
            break
          default:
            sortOptions = { createdAt: -1 } // Default sort by newest
        }
      } else {
        sortOptions = { createdAt: -1 } // Default sort by newest
      }

      // Calculate pagination
      const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

      // Execute query with population
      const orders = await Order.find(query)
        .populate("user", "name email")
        .populate("products.product", "name price images mainImage")
        .sort(sortOptions)
        .skip(skip)
        .limit(Number.parseInt(limit))

      // Get total count for pagination
      const total = await Order.countDocuments(query)

      return res.status(200).json({
        orders,
        pagination: {
          total,
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          pages: Math.ceil(total / Number.parseInt(limit)),
        },
      })
    } catch (error) {
      console.error("Error fetching orders:", error)
      return res.status(500).json({ error: "Failed to fetch orders" })
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params
      const order = await Order.findById(id)
        .populate("user", "name email")
        .populate("products.product", "name price images mainImage")

      if (!order) {
        return res.status(404).json({ error: "Order not found" })
      }

      return res.status(200).json(order)
    } catch (error) {
      console.error("Error fetching order:", error)
      return res.status(500).json({ error: "Failed to fetch order" })
    }
  }

  async store(req, res) {
    try {
      const { userId, products, shippingAddress, paymentMethod, notes } = req.body

      // Verify user exists
      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }

      // Verify products and calculate total
      let totalAmount = 0
      const orderProducts = []

      for (const item of products) {
        const product = await Product.findById(item.productId)
        if (!product) {
          return res.status(404).json({ error: `Product ${item.productId} not found` })
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({ error: `Insufficient stock for ${product.name}` })
        }

        // Add to order products
        orderProducts.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        })

        // Update product stock
        product.stock -= item.quantity
        await product.save()

        // Add to total
        totalAmount += product.price * item.quantity
      }

      // Create order
      const order = new Order({
        user: userId,
        products: orderProducts,
        totalAmount,
        shippingAddress,
        paymentMethod,
        notes,
      })

      await order.save()

      return res.status(201).json({
        status: true,
        message: "Order created successfully!",
        order,
      })
    } catch (error) {
      console.error("Error creating order:", error)
      return res.status(500).json({
        status: false,
        message: "Failed to create order",
        error: error.message,
      })
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { status, paymentStatus, trackingNumber, notes } = req.body

      const order = await Order.findById(id)

      if (!order) {
        return res.status(404).json({ error: "Order not found" })
      }

      // Update fields
      if (status) order.status = status
      if (paymentStatus) order.paymentStatus = paymentStatus
      if (trackingNumber) order.trackingNumber = trackingNumber
      if (notes) order.notes = notes

      await order.save()

      return res.status(200).json({
        status: true,
        message: "Order updated successfully!",
        order,
      })
    } catch (error) {
      console.error("Error updating order:", error)
      return res.status(500).json({
        status: false,
        message: "Failed to update order",
        error: error.message,
      })
    }
  }

  async getStats(req, res) {
    try {
      // Get total orders count
      const totalOrders = await Order.countDocuments()

      // Get total revenue
      const revenueResult = await Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ])
      const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0

      // Get orders by status
      const ordersByStatus = await Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ])

      // Format status data
      const statuses = {}
      ordersByStatus.forEach((item) => {
        statuses[item._id] = item.count
      })

      // Get recent orders
      const recentOrders = await Order.find()
        .populate("user", "name email")
        .populate("products.product", "name")
        .sort({ createdAt: -1 })
        .limit(5)

      return res.status(200).json({
        totalOrders,
        totalRevenue,
        statuses,
        recentOrders,
      })
    } catch (error) {
      console.error("Error fetching order stats:", error)
      return res.status(500).json({ error: "Failed to fetch order statistics" })
    }
  }

  async getUserOrders(req, res) {
    try {
      const { userId } = req.params

      const orders = await Order.find({ user: userId })
        .populate("products.product", "name price images mainImage")
        .sort({ createdAt: -1 })

      return res.status(200).json(orders)
    } catch (error) {
      console.error("Error fetching user orders:", error)
      return res.status(500).json({ error: "Failed to fetch user orders" })
    }
  }
}

export default OrderController
