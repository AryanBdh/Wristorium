import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Payment from "../models/Payment.js";

class OrderController {
  async index(req, res) {
    try {
      const { status, sort, limit = 50, page = 1 } = req.query;

      const query = {};
      if (status) query.status = status;

      let sortOptions = {};
      if (sort) {
        switch (sort) {
          case "newest":
            sortOptions = { createdAt: -1 };
            break;
          case "oldest":
            sortOptions = { createdAt: 1 };
            break;
          case "amount-high":
            sortOptions = { totalAmount: -1 };
            break;
          case "amount-low":
            sortOptions = { totalAmount: 1 };
            break;
          default:
            sortOptions = { createdAt: -1 }; 
        }
      } else {
        sortOptions = { createdAt: -1 }; 
      }

      const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);

      const orders = await Order.find(query)
        .populate("user", "name email")
        .populate("products.product", "name price images mainImage")
        .sort(sortOptions)
        .skip(skip)
        .limit(Number.parseInt(limit));

      // Get total count for pagination
      const total = await Order.countDocuments(query);

      return res.status(200).json({
        orders,
        pagination: {
          total,
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          pages: Math.ceil(total / Number.parseInt(limit)),
        },
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ error: "Failed to fetch orders" });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findById(id)
        .populate("user", "name email")
        .populate("products.product", "name price images mainImage");

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const payment = await Payment.findOne({ order: id });

      return res.status(200).json({
        ...order.toObject(),
        payment: payment || null,
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({ error: "Failed to fetch order" });
    }
  }

  async store(req, res) {
    try {
      const { userId, products, shippingAddress, paymentMethod, notes } =
        req.body;

      console.log("Received order data:", req.body);

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let totalAmount = 0;
      const orderProducts = [];

      for (const item of products) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res
            .status(404)
            .json({ error: `Product ${item.productId} not found` });
        }

        if (product.stock < item.quantity) {
          return res
            .status(400)
            .json({ error: `Insufficient stock for ${product.name}` });
        }

        orderProducts.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        });

        // Update product stock
        product.stock -= item.quantity;
        await product.save();

        totalAmount += product.price * item.quantity * 1.13; 
      }

      const generateOrderNumber = () => {
        const now = new Date();
        const datePart = now.toISOString().slice(2, 10).replace(/-/g, ""); 
        const timePart = now.getTime().toString().slice(-5); 
        const random = Math.floor(100 + Math.random() * 900); 
        return `WH-${datePart}-${timePart}${random}`;
      };

      const roundedTotal=Number(totalAmount.toFixed(2));

      const estimatedDeliveryDate = new Date()
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5)

      // Create order with all required fields
      const order = new Order({
        orderNumber: generateOrderNumber(),
        user: userId,
        phone: user.phone || "",
        products: orderProducts,
        totalAmount: roundedTotal,
        shippingAddress: {
          name: shippingAddress.name || user.name || "",
          street: shippingAddress.street || "",
          city: shippingAddress.city || "",
          district: shippingAddress.district || "",
          zipCode: shippingAddress.zipCode || "",
          country: shippingAddress.country || "",
        },
        paymentMethod,
        paymentStatus:
          paymentMethod === "cash_on_delivery" ? "pending" : "pending",
        status: "processing",
        notes: notes || "",
        deliveryDate: estimatedDeliveryDate,
      });

      console.log("Creating order:", order);

      await order.save();

      console.log("Order saved with orderNumber:", order.orderNumber);

      // Create payment record
      const payment = await Payment.create({
        order: order._id,
        paymentMethod,
        status: paymentMethod === "cash_on_delivery" ? "pending" : "pending",
        amount: totalAmount,
        notes: `Payment for order ${order.orderNumber}`,
      });

      console.log("Payment record created:", payment);

      // For COD, order is immediately successful
      if (paymentMethod === "cash_on_delivery") {
        return res.status(201).json({
          status: true,
          message: "Order placed successfully! You will pay upon delivery.",
          order: {
            _id: order._id,
            orderNumber: order.orderNumber,
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            status: order.status,
            createdAt: order.createdAt,
            products: order.products,
            shippingAddress: order.shippingAddress,
            deliveryDate: order.deliveryDate,
          },
          payment: {
            _id: payment._id,
            paymentMethod: payment.paymentMethod,
            status: payment.status,
            amount: payment.amount,
            createdAt: payment.createdAt,
          },
          isDirectSuccess: true, 
        });
      }

      // For online payments, return order for payment processing
      return res.status(201).json({
        status: true,
        message: "Order created successfully! Please complete payment.",
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          status: order.status,
          createdAt: order.createdAt,
          products: order.products,
          shippingAddress: order.shippingAddress,
          deliveryDate: order.deliveryDate,
        },
        payment: {
          _id: payment._id,
          paymentMethod: payment.paymentMethod,
          status: payment.status,
          amount: payment.amount,
          createdAt: payment.createdAt,
        },
        requiresPayment: true, // Flag to indicate payment is required
      });
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({
        status: false,
        message: "Failed to create order",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { status, paymentStatus, trackingNumber, notes, transactionId, deliveryDate } =
        req.body;

      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Update fields
      if (status) order.status = status;
      if (paymentStatus) order.paymentStatus = paymentStatus;
      if (trackingNumber) order.trackingNumber = trackingNumber;
      if (notes) order.notes = notes;
      if (transactionId) order.transactionId = transactionId;
      if (deliveryDate) order.deliveryDate = deliveryDate;

      if (order.paymentMethod === "cash_on_delivery" && status === "delivered" && order.paymentStatus !== "paid") {
        order.paymentStatus = "paid" 
        console.log(`COD order ${order.orderNumber} marked as paid upon delivery.`)
      }

      await order.save();

      // Update payment record if payment status changed
      if (paymentStatus || transactionId || (order.paymentMethod === "cash_on_delivery" && status === "delivered")) {
        const updateData = {}
        if (paymentStatus) updateData.status = paymentStatus
        if (transactionId) updateData.transactionId = transactionId
        if (paymentStatus === "paid" || (order.paymentMethod === "cash_on_delivery" && status === "delivered")) {
          updateData.paidAt = new Date()
        }

        await Payment.findOneAndUpdate({ order: id }, updateData, { new: true })
      }

      return res.status(200).json({
        status: true,
        message: "Order updated successfully!",
        order,
      });
    } catch (error) {
      console.error("Error updating order:", error);
      return res.status(500).json({
        status: false,
        message: "Failed to update order",
        error: error.message,
      });
    }
  }

  async cancelOrder(req, res) {
    try {
      const { id } = req.params
      const { userId } = req.body

      console.log(`Attempting to cancel order ${id} for user ${userId}`)

      const order = await Order.findById(id).populate("products.product")

      if (!order) {
        return res.status(404).json({
          status: false,
          message: "Order not found",
        })
      }

      // Check if the order belongs to the user
      if (order.user.toString() !== userId) {
        return res.status(403).json({
          status: false,
          message: "You can only cancel your own orders",
        })
      }

      // Check if order can be cancelled (only processing orders can be cancelled)
      if (order.status !== "processing") {
        return res.status(400).json({
          status: false,
          message: `Cannot cancel order with status: ${order.status}`,
        })
      }

      console.log("Order found and can be cancelled:", order.orderNumber)

      // Restore product stock for each item in the order
      for (const item of order.products) {
        if (item.product) {
          const product = await Product.findById(item.product._id)
          if (product) {
            product.stock += item.quantity
            await product.save()
            console.log(`Restored ${item.quantity} stock for product ${product.name}`)
          }
        }
      }

      const paymentDeleted = await Payment.findOneAndDelete({ order: id })
      console.log("Payment record deleted:", paymentDeleted ? "Yes" : "No")

      // Delete the order from database
      const deletedOrder = await Order.findByIdAndDelete(id)
      console.log("Order deleted:", deletedOrder ? "Yes" : "No")

      return res.status(200).json({
        status: true,
        message: "Order cancelled and removed successfully!",
        orderNumber: order.orderNumber,
      })
    } catch (error) {
      console.error("Error cancelling order:", error)
      return res.status(500).json({
        status: false,
        message: "Failed to cancel order",
        error: error.message,
      })
    }
  }

  async getStats(req, res) {
    try {
      // Get total orders count
      const totalOrders = await Order.countDocuments();

      // Get total revenue
      const revenueResult = await Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]);
      const totalRevenue =
        revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

      // Get orders by status
      const ordersByStatus = await Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      // Get payment statistics
      const paymentStats = await Payment.aggregate([
        {
          $group: {
            _id: "$paymentMethod",
            count: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
          },
        },
      ]);

      // Format status data
      const statuses = {};
      ordersByStatus.forEach((item) => {
        statuses[item._id] = item.count;
      });

      // Get recent orders
      const recentOrders = await Order.find()
        .populate("user", "name email")
        .populate("products.product", "name")
        .sort({ createdAt: -1 })
        .limit(5);

      return res.status(200).json({
        totalOrders,
        totalRevenue,
        statuses,
        paymentStats,
        recentOrders,
      });
    } catch (error) {
      console.error("Error fetching order stats:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch order statistics" });
    }
  }

  async getUserOrders(req, res) {
    try {
      const { userId } = req.params;

      const orders = await Order.find({ user: userId })
        .populate("products.product", "name price images mainImage")
        .sort({ createdAt: -1 });

      // Get payment information for each order
      const ordersWithPayments = await Promise.all(
        orders.map(async (order) => {
          const payment = await Payment.findOne({ order: order._id });
          return {
            ...order.toObject(),
            payment: payment || null,
          };
        })
      );

      return res.status(200).json(ordersWithPayments);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      return res.status(500).json({ error: "Failed to fetch user orders" });
    }
  }
}

export default OrderController;
