"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Button from "../ui/Button"
import { CheckCircle, Loader, Package, Truck } from "lucide-react" // Import Truck icon

const OrderSuccess = () => {
  const { orderId } = useParams()
  const [loading, setLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = localStorage.getItem("token")

      try {
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (response.ok) {
          setOrderDetails(data)
        } else {
          setError(data.message || "Failed to fetch order details")
        }
      } catch (error) {
        console.error("Error fetching order:", error)
        setError("Failed to fetch order details")
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="bg-[#162337] text-white min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-[#0f1420] rounded-lg p-8 text-center">
            <Loader className="w-16 h-16 text-[#d4af37] animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Loading Order Details</h2>
            <p className="text-gray-400">Please wait...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#162337] text-white min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-[#0f1420] rounded-lg p-8 text-center">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <Button
              onClick={() => (window.location.href = "/shop")}
              className="bg-[#d4af37] text-black hover:bg-[#b8973a]"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#162337] text-white min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-[#0f1420] rounded-lg p-8">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-green-500">Order Placed Successfully!</h2>
            <p className="text-gray-400 mb-6">
              Your order has been placed successfully.
              {orderDetails?.paymentMethod === "cash_on_delivery" && " You will pay when you receive your order."}
            </p>

            {orderDetails && (
              <div className="bg-[#121826] rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold mb-3 text-[#d4af37] flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Order Number:</span>
                    <span className="text-white font-medium">{orderDetails.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Amount:</span>
                    <span className="text-[#d4af37] font-semibold">
                      Rs. {orderDetails.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment Method:</span>
                    <span className="text-white">
                      {orderDetails.paymentMethod === "cash_on_delivery"
                        ? "Cash on Delivery"
                        : orderDetails.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Order Status:</span>
                    <span className="text-green-500 font-medium capitalize">{orderDetails.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Order Date:</span>
                    <span className="text-white">{formatDate(orderDetails.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Estimated Delivery:</span>
                    <span className="text-white">{formatDate(orderDetails.deliveryDate)}</span>
                  </div>
                  {orderDetails.trackingNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tracking Number:</span>
                      <span className="text-white">{orderDetails.trackingNumber}</span>
                    </div>
                  )}
                </div>

                {/* Shipping Address */}
                {orderDetails.shippingAddress && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <h4 className="font-semibold mb-2 text-[#d4af37]">Shipping Address:</h4>
                    <div className="text-sm text-gray-300">
                      <p>{orderDetails.shippingAddress.name}</p>
                      <p>{orderDetails.shippingAddress.street}</p>
                      <p>
                        {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.district}
                      </p>
                      <p>{orderDetails.shippingAddress.zipCode}</p>
                      {orderDetails.shippingAddress.phone && <p>Phone: {orderDetails.shippingAddress.phone}</p>}
                    </div>
                  </div>
                )}

                {/* Order Items */}
                {orderDetails.products && orderDetails.products.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <h4 className="font-semibold mb-2 text-[#d4af37]">Items Ordered:</h4>
                    <div className="space-y-2">
                      {orderDetails.products.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-300">
                            {item.product?.name || "Product"} x {item.quantity}
                          </span>
                          <span className="text-[#d4af37]">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => (window.location.href = `/profile`)} // Link to user profile for order history
                className="bg-[#d4af37] text-black hover:bg-[#b8973a]"
              >
                <Truck className="h-4 w-4 mr-2" />
                View My Orders
              </Button>
              <Button
                onClick={() => (window.location.href = "/shop")}
                variant="outline"
                className="border-gray-600 hover:bg-gray-800"
              >
                Continue Shopping
              </Button>
            </div>

            {orderDetails?.paymentMethod === "cash_on_delivery" && (
              <div className="mt-6 p-4 bg-[#1a2332] rounded-lg border border-[#d4af37]/20">
                <p className="text-sm text-gray-300">
                  <strong className="text-[#d4af37]">Note:</strong> Your order will be delivered to your address. Please
                  keep the exact amount ready for payment upon delivery.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
