"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Input from "../ui/Input";
import toast from "react-hot-toast";
import { MapPin, CreditCard, ArrowLeft } from "lucide-react";

const AdminOrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [formData, setFormData] = useState({
    status: "",
    paymentStatus: "",
    trackingNumber: "",
    deliveryDate: "",
    notes: "",
  });

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          toast.error("Please login to access this page.");
          return;
        }

        const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch order");
        }

        const generateTrackingNumber = () => {
          const datePart = new Date()
            .toISOString()
            .split("T")[0]
            .replace(/-/g, "");
          const randomPart = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();
          return `TRK-${datePart}-${randomPart}`;
        };

        const calculateDeliveryDate = (orderDate) => {
          const date = new Date(orderDate);
          date.setDate(date.getDate() + 5);
          return date.toISOString().split("T")[0];
        };

        setOrder(data);
        setFormData({
          status: data.status || "",
          paymentStatus: data.paymentStatus || "",
          trackingNumber: data.trackingNumber || generateTrackingNumber(),
          deliveryDate: data.deliveryDate
            ? new Date(data.deliveryDate).toISOString().split("T")[0]
            : calculateDeliveryDate(data.createdAt || new Date()),
          notes: data.notes || "",
        });
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        toast.error("Please login to access this page.");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update order");
      }

      setOrder(data.order); // Update local state with new order data
      toast.success("Order updated successfully!");
      navigate("/admin/dashboard?tab=orders"); // Redirect back to orders tab
    } catch (err) {
      console.error("Error updating order:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "text-green-400 bg-green-900/20";
      case "shipped":
        return "text-blue-400 bg-blue-900/20";
      case "processing":
        return "text-yellow-400 bg-yellow-900/20";
      case "cancelled":
        return "text-red-400 bg-red-900/20";
      case "pending":
        return "text-orange-400 bg-orange-900/20";
      case "paid":
        return "text-green-400 bg-green-900/20";
      case "failed":
        return "text-red-400 bg-red-900/20";
      default:
        return "text-gray-400 bg-gray-900/20";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-[#162337] text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="bg-[#162337] text-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-[#0f1420] rounded-lg">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <Button
            onClick={() => navigate("/admin/dashboard?tab=orders")}
            className="bg-[#d4af37] hover:bg-[#b8973a] text-black"
          >
            Go to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#162337] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">
            Edit Order: {order?.orderNumber}
          </h1>
          <Button
            onClick={() => navigate("/admin/dashboard?tab=orders")}
            variant="outline"
            className="border-gray-600 hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0f1420] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Order ID:</p>
                  <p className="font-medium">{order?._id}</p>
                </div>
                <div>
                  <p className="text-gray-400">Order Number:</p>
                  <p className="font-medium">{order?.orderNumber}</p>
                </div>
                <div>
                  <p className="text-gray-400">Customer:</p>
                  <p className="font-medium">{order?.user?.name || "N/A"}</p>
                  <p className="text-gray-500">{order?.user?.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-400">Total Amount:</p>
                  <p className="font-medium text-[#d4af37]">
                    Rs. {order?.totalAmount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Order Date:</p>
                  <p className="font-medium">{formatDate(order?.createdAt)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Payment Method:</p>
                  <p className="font-medium capitalize">
                    {order?.paymentMethod?.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Current Status:</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order?.status
                    )}`}
                  >
                    {order?.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400">Current Payment Status:</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order?.paymentStatus
                    )}`}
                  >
                    {order?.paymentStatus}
                  </span>
                </div>
                {order?.trackingNumber && (
                  <div>
                    <p className="text-gray-400">Tracking Number:</p>
                    <p className="font-medium">{order.trackingNumber}</p>
                  </div>
                )}
                {order?.deliveryDate && (
                  <div>
                    <p className="text-gray-400">Delivery Date:</p>
                    <p className="font-medium">
                      {formatDate(order.deliveryDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-[#0f1420] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Items Ordered</h2>
              <div className="space-y-4">
                {order?.products?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-[#1a1f2c] rounded-lg"
                  >
                    <img
                      src={
                        item.product?.images?.[0]
                          ? `http://localhost:5000/products/${item.product.images[0]}`
                          : item.product?.mainImage
                          ? `http://localhost:5000/products/${item.product.mainImage}`
                          : "/placeholder.svg?height=60&width=60"
                      }
                      alt={item.product?.name || "Product"}
                      className="w-16 h-16 rounded object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=60&width=60";
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {item.product?.name || "Product"}
                      </h4>
                      <p className="text-sm text-gray-400">
                        Qty: {item.quantity} × Rs.{" "}
                        {item.price?.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right font-semibold text-[#d4af37]">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {order?.shippingAddress && (
              <div className="bg-[#0f1420] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </h2>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.district}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p>Phone: {order.shippingAddress.phone}</p>
                  )}
                </div>
              </div>
            )}

            {/* Payment Details */}
            {order?.payment && (
              <div className="bg-[#0f1420] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Details
                </h2>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>
                    Method:{" "}
                    <span className="capitalize">
                      {order.payment.paymentMethod?.replace("_", " ")}
                    </span>
                  </p>
                  <p>
                    Status:{" "}
                    <span className={getStatusColor(order.payment.status)}>
                      {order.payment.status}
                    </span>
                  </p>
                  <p>
                    Amount:{" "}
                    <span className="text-[#d4af37]">
                      Rs. {order.payment.amount?.toLocaleString()}
                    </span>
                  </p>
                  {order.payment.transactionId && (
                    <p>Transaction ID: {order.payment.transactionId}</p>
                  )}
                  {order.payment.paidAt && (
                    <p>Paid At: {formatDate(order.payment.paidAt)}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Update Form Column */}
          <div className="lg:col-span-1">
            <form
              onSubmit={handleSubmit}
              className="bg-[#0f1420] rounded-lg p-6 space-y-6"
            >
              <h2 className="text-xl font-semibold mb-4">
                Update Order Status
              </h2>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium mb-2"
                >
                  Order Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-[#1a1f2c] border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-[#d4af37] focus:border-[#d4af37]"
                >
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="paymentStatus"
                  className="block text-sm font-medium mb-2"
                >
                  Payment Status
                </label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className="w-full bg-[#1a1f2c] border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-[#d4af37] focus:border-[#d4af37]"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="trackingNumber"
                  className="block text-sm font-medium mb-2"
                >
                  Tracking Number
                </label>
                <Input
                  id="trackingNumber"
                  name="trackingNumber"
                  type="text"
                  value={formData.trackingNumber}
                  onChange={handleChange}
                  placeholder="Enter tracking number"
                  readonly
                />
              </div>

              <div>
                <label
                  htmlFor="deliveryDate"
                  className="block text-sm font-medium mb-2"
                >
                  Delivery Date
                </label>
                <Input
                  id="deliveryDate"
                  name="deliveryDate"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium mb-2"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-[#1a1f2c] border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-[#d4af37] focus:border-[#d4af37]"
                  placeholder="Add internal notes about the order..."
                ></textarea>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#d4af37] text-black hover:bg-[#b8973a] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                {submitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    Updating...
                  </div>
                ) : (
                  "Update Order"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderEdit;
