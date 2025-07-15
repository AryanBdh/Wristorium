import Order from "../models/Order.js"
import Payment from "../models/Payment.js" // Note: Capital M in Models
import { getEsewaPaymentParams, verifyEsewaPayment, ESEWA_CONFIG } from "../utils/esewa.js"

class PaymentController {
  // Initiate eSewa payment
  async initiateEsewaPayment(req, res) {
    try {
      const { orderId } = req.body
      console.log("=== eSewa Payment Initiation ===")
      console.log("Order ID:", orderId)

      const order = await Order.findById(orderId).populate("user", "name email")
      if (!order) {
        console.log("Order not found:", orderId)
        return res.status(404).json({ success: false, message: "Order not found" })
      }

      console.log("Order found:", {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        user: order.user.email,
      })

      // Use order._id as transaction_uuid as per the example
      const params = getEsewaPaymentParams({
        amount: order.totalAmount,
        transaction_uuid: order._id.toString(), // Use order ID as transaction_uuid
      })

      console.log("eSewa Parameters for Form:", params)
      console.log("Payment URL:", ESEWA_CONFIG.PAYMENT_URL)
      console.log("================================")

      return res.status(200).json({
        success: true,
        message: "Payment initiated",
        params,
        paymentUrl: ESEWA_CONFIG.PAYMENT_URL, // Include the correct v2 payment URL
      })
    } catch (err) {
      console.error("Esewa init error:", err)
      return res.status(500).json({
        success: false,
        message: "Esewa init failed",
        error: err.message,
      })
    }
  }

  // Handle eSewa success callback (eSewa sends GET request with 'data' query param)
  async handleEsewaSuccessCallback(req, res) {
    try {
      const { data } = req.query // eSewa sends encoded data in 'data' query param for success
      console.log("eSewa Success Callback received. Encoded Data:", data)

      if (!data) {
        console.error("Missing 'data' parameter in eSewa success callback.")
        return res.redirect(
          `${process.env.FRONTEND_URL}/esewa/failure?error=${encodeURIComponent("Missing payment data")}`,
        )
      }

      const paymentInfo = await verifyEsewaPayment(data) // Use the new verification function

      const { transaction_uuid, total_amount, transaction_code, status } = paymentInfo.decodedData
      const orderId = transaction_uuid // Our order ID is the transaction_uuid

      // Find order by order ID (which is transaction_uuid)
      const order = await Order.findById(orderId)

      if (!order) {
        console.error("Order not found for transaction_uuid:", orderId)
        return res.redirect(`${process.env.FRONTEND_URL}/esewa/failure?error=${encodeURIComponent("Order not found")}`)
      }

      // Update order status
      order.paymentStatus = "paid"
      order.transactionId = transaction_code // Use transaction_code as transactionId
      order.paymentGatewayResponse = {
        transaction_uuid,
        total_amount,
        transaction_code,
        status,
        verifiedAt: new Date(),
        fullResponse: paymentInfo.response, // Store full response from eSewa status check
      }
      await order.save()

      // Update payment record
      await Payment.findOneAndUpdate(
        { order: order._id },
        {
          status: "paid",
          transactionId: transaction_code,
          paidAt: new Date(),
          gatewayResponse: {
            transaction_uuid,
            total_amount,
            transaction_code,
            status,
            verifiedAt: new Date(),
            fullResponse: paymentInfo.response,
          },
        },
        { new: true },
      )

      console.log("Payment verified successfully for order:", order.orderNumber)

      // Redirect to frontend success page with relevant parameters
      console.log("Redirecting to /user-profile after successful payment.")
return res.redirect(`http://localhost:5173/profile`)
    } catch (error) {
      console.error("Error handling eSewa success callback:", error)
      // Redirect to frontend failure page in case of an error during callback handling
      return res.redirect(
        `${process.env.FRONTEND_URL}/esewa/failure?error=${encodeURIComponent(
          error.message || "Callback processing failed",
        )}`,
      )
    }
  }

  // Handle eSewa failure callback (eSewa sends GET request to this endpoint)
  async handleEsewaFailureCallback(req, res) {
    try {
      console.log("eSewa Failure Callback received:", req.query) // Failure callback is usually GET
      // Redirect to frontend failure page
      return res.redirect(`${process.env.FRONTEND_URL}/esewa/failure`)
    } catch (error) {
      console.error("Error handling eSewa failure callback:", error)
      return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/checkout?error=${encodeURIComponent("Order not found")}`)

    }
  }

  // This verify endpoint is for our internal use, not eSewa's callback
  async verifyEsewaPayment(req, res) {
    try {
      const { oid, amt, refId } = req.body // These are from our frontend's success page query params
      console.log("Internal verification request:", { oid, amt, refId })

      // Find order by order number
      const order = await Order.findOne({ orderNumber: oid })

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        })
      }

      // Check if the order's payment status is already 'paid' and transaction ID matches
      if (order.paymentStatus === "paid" && order.transactionId === refId) {
        return res.status(200).json({
          success: true,
          message: "Payment already verified successfully",
          order: {
            _id: order._id,
            orderNumber: order.orderNumber,
            paymentStatus: order.paymentStatus,
            transactionId: order.transactionId,
          },
        })
      }

      // If not already paid, we might need to re-verify with eSewa if refId is available
      // This part is tricky because we don't have the full 'data' object from eSewa here.
      // The primary verification should happen in handleEsewaSuccessCallback.
      // This endpoint is more for checking the status after the fact.
      if (order.paymentStatus === "pending" && refId) {
        // In a real scenario, you'd re-construct the verification data or
        // query eSewa's transaction status API directly using refId (transaction_code)
        // For simplicity, we'll assume handleEsewaSuccessCallback is the primary verifier.
        return res.status(400).json({
          success: false,
          message: "Payment not yet verified by eSewa callback. Please wait or check order status.",
        })
      }

      return res.status(400).json({
        success: false,
        message: "Invalid payment parameters or status",
      })
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
