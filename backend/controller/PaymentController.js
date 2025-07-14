import Order from "../models/Order.js"
import Payment from "../models/Payment.js"

class PaymentController {
  // Initiate eSewa payment
  async initiateEsewaPayment(req, res) {
    try {
      const { orderId } = req.body

      console.log("Initiating eSewa payment for order:", orderId)

      // Get order details
      const order = await Order.findById(orderId).populate("user", "name email")

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        })
      }

      // eSewa configuration
      const esewaConfig = {
        merchant_code: process.env.ESEWA_MERCHANT_CODE || "EPAYTEST",
        success_url: `${process.env.FRONTEND_URL}/esewa/success`,
        failure_url: `${process.env.FRONTEND_URL}/esewa/failure`,
        payment_url: process.env.ESEWA_PAYMENT_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
      }

      // Prepare payment parameters
      const paymentParams = {
        amt: order.totalAmount,
        pdc: 0, // Delivery charge
        psc: 0, // Service charge
        txAmt: 0, // Tax amount
        tAmt: order.totalAmount, // Total amount
        pid: order.orderNumber, // Product/Order ID
        scd: esewaConfig.merchant_code, // Merchant code
        su: esewaConfig.success_url,
        fu: esewaConfig.failure_url,
      }

      console.log("eSewa payment parameters:", paymentParams)

      return res.status(200).json({
        success: true,
        message: "Payment initiated successfully",
        payment_url: esewaConfig.payment_url,
        params: paymentParams,
      })
    } catch (error) {
      console.error("Error initiating eSewa payment:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to initiate payment",
        error: error.message,
      })
    }
  }

  // Verify eSewa payment
  async verifyEsewaPayment(req, res) {
    try {
      const { oid, amt, refId } = req.body

      console.log("Verifying eSewa payment:", { oid, amt, refId })

      // Find order by order number
      const order = await Order.findOne({ orderNumber: oid })

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        })
      }

      // In a real implementation, you would verify with eSewa API
      // For now, we'll assume the payment is successful if we have the required parameters
      if (oid && amt && refId) {
        // Update order status
        order.paymentStatus = "paid"
        order.transactionId = refId
        order.paymentGatewayResponse = {
          oid,
          amt,
          refId,
          verifiedAt: new Date(),
        }

        await order.save()

        // Update payment record
        await Payment.findOneAndUpdate(
          { order: order._id },
          {
            status: "paid",
            transactionId: refId,
            paidAt: new Date(),
            gatewayResponse: {
              oid,
              amt,
              refId,
              verifiedAt: new Date(),
            },
          },
          { new: true },
        )

        console.log("Payment verified successfully for order:", order.orderNumber)

        return res.status(200).json({
          success: true,
          message: "Payment verified successfully",
          order: {
            _id: order._id,
            orderNumber: order.orderNumber,
            paymentStatus: order.paymentStatus,
            transactionId: order.transactionId,
          },
        })
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid payment parameters",
        })
      }
    } catch (error) {
      console.error("Error verifying eSewa payment:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to verify payment",
        error: error.message,
      })
    }
  }

  // Get payment status
  async getPaymentStatus(req, res) {
    try {
      const { orderId } = req.params

      const payment = await Payment.findOne({ order: orderId }).populate("order", "orderNumber paymentStatus")

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        })
      }

      return res.status(200).json({
        success: true,
        payment,
      })
    } catch (error) {
      console.error("Error fetching payment status:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to fetch payment status",
        error: error.message,
      })
    }
  }
}

export default PaymentController
