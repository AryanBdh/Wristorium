"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import toast from "react-hot-toast"
import Button from "../ui/Button"
import { CheckCircle, XCircle, Loader } from "lucide-react"

const EsewaCallback = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState("loading") // loading, success, failed
  const [orderDetails, setOrderDetails] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const verifyEsewaPayment = async () => {
      const token = localStorage.getItem("token")

      try {
        // Get parameters from URL
        const oid = searchParams.get("oid") // Order ID
        const amt = searchParams.get("amt") // Amount
        const refId = searchParams.get("refId") // Reference ID from eSewa

        console.log("eSewa callback params:", { oid, amt, refId })

        // Check if we have required parameters
        if (!oid || !amt || !refId) {
          console.error("Missing required parameters")
          setStatus("failed")
          setError("Missing payment parameters")
          return
        }

        // Verify payment with backend
        console.log("Verifying payment with backend...")
        const response = await fetch("http://localhost:5000/api/payments/esewa/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oid,
            amt,
            refId,
          }),
        })

        const data = await response.json()
        console.log("Verification response:", data)

        if (data.success) {
          setStatus("success")
          setOrderDetails(data.order)
          toast.success("Payment successful! Your order has been confirmed.")

          // Clear cart after successful payment
          const { clearCart } = await import("../context/CartContext")
          if (clearCart) clearCart()
        } else {
          console.error("Payment verification failed:", data)
          setStatus("failed")
          setError(data.message || "Payment verification failed")
          toast.error(data.message || "Payment verification failed")
        }
      } catch (error) {
        console.error("Payment verification error:", error)
        setStatus("failed")
        setError(error.message || "Payment verification failed")
        toast.error("Payment verification failed")
      }
    }

    // Check if this is a success callback
    const currentPath = window.location.pathname
    if (currentPath.includes("/success")) {
      verifyEsewaPayment()
    } else if (currentPath.includes("/failure")) {
      setStatus("failed")
      setError("Payment was cancelled or failed")
      toast.error("Payment was cancelled or failed")
    }
  }, [searchParams])

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="text-center">
            <Loader className="w-16 h-16 text-[#d4af37] animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
            <p className="text-gray-400">Please wait while we confirm your payment with eSewa...</p>
          </div>
        )

      case "success":
        return (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-green-500">Payment Successful!</h2>
            <p className="text-gray-400 mb-6">
              Your payment has been processed successfully and your order has been confirmed.
            </p>
            {orderDetails && (
              <div className="bg-[#0f1420] rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold mb-2 text-[#d4af37]">Order Details:</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-300">
                    <span className="text-gray-400">Order Number:</span> {orderDetails.orderNumber}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Total Amount:</span> Rs.{" "}
                    {orderDetails.totalAmount?.toLocaleString()}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Payment Method:</span> eSewa
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Payment Status:</span>
                    <span className="text-green-500 ml-1 font-medium">Paid</span>
                  </p>
                  {orderDetails.transactionId && (
                    <p className="text-gray-300">
                      <span className="text-gray-400">Transaction ID:</span> {orderDetails.transactionId}
                    </p>
                  )}
                  <p className="text-gray-300">
                    <span className="text-gray-400">Order Date:</span>{" "}
                    {new Date(orderDetails.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => (window.location.href = `/orders/${orderDetails?._id}`)}
                className="bg-[#d4af37] text-black hover:bg-[#b8973a]"
              >
                View Order Details
              </Button>
              <Button
                onClick={() => (window.location.href = "/shop")}
                variant="outline"
                className="border-gray-600 hover:bg-gray-800"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )

      case "failed":
        return (
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-red-500">Payment Failed</h2>
            <p className="text-gray-400 mb-2">We couldn't process your payment.</p>
            {error && <p className="text-red-400 text-sm mb-6">Error: {error}</p>}
            <p className="text-gray-400 mb-6">Please try again or contact support if the problem persists.</p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => (window.location.href = "/checkout")}
                className="bg-[#d4af37] text-black hover:bg-[#b8973a]"
              >
                Try Again
              </Button>
              <Button
                onClick={() => (window.location.href = "/cart")}
                variant="outline"
                className="border-gray-600 hover:bg-gray-800"
              >
                Back to Cart
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-[#162337] text-white min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-[#0f1420] rounded-lg p-8">{renderContent()}</div>
      </div>
    </div>
  )
}

export default EsewaCallback
