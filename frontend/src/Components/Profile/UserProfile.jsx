"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { User, MapPin, Package, Edit, Save, X, Eye, Home, CreditCard, Truck, AlertTriangle } from "lucide-react"
import Button from "../../ui/Button"
import Input from "../../ui/Input"
import toast from "react-hot-toast"

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [cancellingOrder, setCancellingOrder] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState(null)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    addresses: [],
  })

  const [orders, setOrders] = useState([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)

  const user = JSON.parse(localStorage.getItem("user")) || {}

  // Load user data on mount
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          setLoading(false)
          return
        }

        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Failed to fetch profile")

        const userData = await res.json()

        // Update both local state and localStorage
        setProfileData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          addresses: userData.addresses || [],
        })

        localStorage.setItem("user", JSON.stringify(userData))
        setLoading(false)
      } catch (error) {
        console.error("Profile fetch error:", error)
        toast.error("Failed to load profile")
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  // Load user orders
  useEffect(() => {
    async function fetchUserOrders() {
      try {
        const token = localStorage.getItem("token")
        const user = JSON.parse(localStorage.getItem("user"))

        if (!token || !user?._id) return

        setOrdersLoading(true)

        const res = await fetch(`http://localhost:5000/api/orders/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Failed to fetch orders")

        const ordersData = await res.json()
        console.log("Fetched orders:", ordersData)
        setOrders(ordersData)
      } catch (error) {
        console.error("Orders fetch error:", error)
        toast.error("Failed to load orders")
      } finally {
        setOrdersLoading(false)
      }
    }

    if (user._id) {
      fetchUserOrders()
    }
  }, [user._id])

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrder(orderId)
      const token = localStorage.getItem("token")
      const user = JSON.parse(localStorage.getItem("user"))

      if (!token || !user?._id) {
        toast.error("You must be logged in")
        return
      }

      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel order")
      }

      // Remove the cancelled order from the local state
      setOrders(orders.filter((order) => order._id !== orderId))

      toast.success(`Order ${data.orderNumber} cancelled successfully!`)
      setShowCancelModal(false)
      setOrderToCancel(null)
    } catch (error) {
      console.error("Cancel order error:", error)
      toast.error(error.message || "Failed to cancel order")
    } finally {
      setCancellingOrder(null)
    }
  }

  // Handle save click - send update request to backend
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      const user = JSON.parse(localStorage.getItem("user"))

      if (!token) {
        toast.error("You must be logged in")
        return
      }

      const updatePayload = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        addresses: profileData.addresses,
      }

      const res = await fetch(`http://localhost:5000/api/user/update/${user._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Update failed")

      toast.success("Profile updated successfully")
      localStorage.setItem("user", JSON.stringify(data.user))
      setIsEditing(false)
    } catch (error) {
      toast.error(error.message || "Failed to update profile")
    }
  }

  const handleSaveAddress = () => {
    if (!editingAddress) return

    let newAddresses
    if (editingAddress._id) {
      // update existing address
      newAddresses = profileData.addresses.map((addr) => (addr._id === editingAddress._id ? editingAddress : addr))
    } else {
      // add new address - generate temp id for React keys if needed
      newAddresses = [...profileData.addresses, { ...editingAddress, _id: Date.now().toString() }]
    }

    setProfileData({ ...profileData, addresses: newAddresses })
    setShowAddressForm(false)
    setEditingAddress(null)
  }

  // Delete address
  const handleDeleteAddress = (id) => {
    const newAddresses = profileData.addresses.filter((addr) => addr._id !== id)
    setProfileData({ ...profileData, addresses: newAddresses })
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "text-green-400"
      case "shipped":
        return "text-blue-400"
      case "processing":
        return "text-yellow-400"
      case "cancelled":
        return "text-red-400"
      case "pending":
        return "text-orange-400"
      default:
        return "text-gray-400"
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "text-green-400"
      case "pending":
        return "text-yellow-400"
      case "failed":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatPrice = (price) => {
    return `Rs. ${price?.toLocaleString()}`
  }

  const canCancelOrder = (order) => {
    return order.status === "processing" && order.paymentStatus !== "paid"
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Orders", icon: Package },
  ]

  if (loading) {
    return (
      <div className="bg-[#162337] text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#162337] text-white min-h-screen">
      {/* Header */}
      <div className="bg-[#0f1420] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Account</h1>
              <p className="text-gray-400">Manage your WHRISTORIUM account and preferences</p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" className="border-gray-600 hover:bg-gray-800 bg-transparent">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-[#0f1420] rounded-lg p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-800">
                <div className="w-16 h-16 bg-[#1a1f2c] rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="font-semibold">{profileData.name}</h3>
                  <p className="text-sm text-gray-400">{orders.length} orders</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id ? "bg-[#d4af37] text-black" : "hover:bg-[#1a1f2c] text-gray-300"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.label}
                      {tab.id === "orders" && orders.length > 0 && (
                        <span className="ml-auto bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                          {orders.length}
                        </span>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Profile Information */}
                <div className="bg-[#0f1420] rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Profile Information</h2>
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className="border-gray-600 hover:bg-gray-800"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveProfile}
                          size="sm"
                          className="bg-[#d4af37] hover:bg-[#b8973a] text-black"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          size="sm"
                          className="border-gray-600 bg-transparent"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <Input
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className={!isEditing ? "bg-[#1a1f2c] border-gray-700" : ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className={!isEditing ? "bg-[#1a1f2c] border-gray-700" : ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <Input
                        value={profileData.phone}
                        maxLength={10}
                        onChange={(e) => {
                          if (/^\d*$/.test(e.target.value)) {
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                        }}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-[#1a1f2c] border-gray-700" : ""}
                      />
                    </div>

                    {/* Address part */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Addresses</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {profileData.addresses.map((address) => (
                          <div key={address._id} className="bg-[#1a1f2c] rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{address.type}</h3>
                              {address.isDefault && (
                                <span className="bg-[#d4af37] text-black text-xs px-2 py-1 rounded">Default</span>
                              )}
                            </div>
                            <div className="text-sm space-y-1 mb-4">
                              <div className="font-medium">{address.name}</div>
                              <div>{address.street}</div>
                              <div>
                                {address.city}, {address.district} {address.zipCode}
                              </div>
                              <div>{address.country}</div>
                            </div>
                            {isEditing && (
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-600 bg-transparent"
                                  onClick={() => {
                                    setEditingAddress(address)
                                    setShowAddressForm(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-600 bg-transparent"
                                  onClick={() => handleDeleteAddress(address._id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {isEditing && (
                        <Button
                          onClick={() => {
                            setEditingAddress({
                              type: "",
                              name: "",
                              street: "",
                              city: "",
                              district: "",
                              zipCode: "",
                              country: "",
                              isDefault: false,
                            })
                            setShowAddressForm(true)
                          }}
                          className="mt-4 bg-[#d4af37] hover:bg-[#b8973a] text-black"
                        >
                          Add New Address
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#0f1420] rounded-lg p-6 text-center">
                    <Package className="h-8 w-8 text-[#d4af37] mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">{orders.length}</div>
                    <div className="text-sm text-gray-400">Total Orders</div>
                  </div>
                  <div className="bg-[#0f1420] rounded-lg p-6 text-center">
                    <CreditCard className="h-8 w-8 text-[#d4af37] mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">
                      {formatPrice(orders.reduce((total, order) => total + (order.totalAmount || 0), 0))}
                    </div>
                    <div className="text-sm text-gray-400">Total Spent</div>
                  </div>
                  <div className="bg-[#0f1420] rounded-lg p-6 text-center">
                    <Truck className="h-8 w-8 text-[#d4af37] mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">
                      {orders.filter((order) => order.status === "delivered").length}
                    </div>
                    <div className="text-sm text-gray-400">Delivered</div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-[#0f1420] rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Recent Orders</h2>
                    <button onClick={() => setActiveTab("orders")} className="text-[#d4af37] hover:underline text-sm">
                      View All Orders →
                    </button>
                  </div>

                  {ordersLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No orders yet</p>
                      <Link to="/shop">
                        <Button className="bg-[#d4af37] hover:bg-[#b8973a] text-black">Start Shopping</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order._id} className="flex items-center justify-between p-4 bg-[#1a1f2c] rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#d4af37] rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-black" />
                            </div>
                            <div>
                              <div className="font-medium">{order.orderNumber}</div>
                              <div className="text-sm text-gray-400">
                                {formatDate(order.createdAt)} • {order.products?.length || 0} items
                              </div>
                              <div className="text-sm text-gray-400">
                                Payment: <span className="capitalize">{order.paymentMethod?.replace("_", " ")}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatPrice(order.totalAmount)}</div>
                            <div className={`text-sm ${getStatusColor(order.status)} capitalize`}>{order.status}</div>
                            <div className={`text-xs ${getPaymentStatusColor(order.paymentStatus)} capitalize`}>
                              {order.paymentStatus}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-[#0f1420] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Order History</h2>

                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
                    <Link to="/shop">
                      <Button className="bg-[#d4af37] hover:bg-[#b8973a] text-black">Browse Products</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-gray-700 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">Order {order.orderNumber}</h3>
                            <p className="text-sm text-gray-400">Placed on {formatDate(order.createdAt)}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className={`text-sm ${getStatusColor(order.status)} capitalize`}>
                                Status: {order.status}
                              </span>
                              <span className={`text-sm ${getPaymentStatusColor(order.paymentStatus)} capitalize`}>
                                Payment: {order.paymentStatus}
                              </span>
                              <span className="text-sm text-gray-400 capitalize">
                                Method: {order.paymentMethod?.replace("_", " ")}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-lg">{formatPrice(order.totalAmount)}</div>
                            <div className="text-sm text-gray-400">{order.products?.length || 0} items</div>
                          </div>
                        </div>

                        {/* Order Products */}
                        <div className="space-y-3 mb-4">
                          {order.products?.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 bg-[#1a1f2c] rounded-lg">
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
                                  e.target.src = "/placeholder.svg?height=60&width=60"
                                }}
                              />
                              <div className="flex-1">
                                <h4 className="font-medium">{item.product?.name || "Product"}</h4>
                                <p className="text-sm text-gray-400">
                                  Quantity: {item.quantity} × {formatPrice(item.price)}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Shipping Address */}
                        {order.shippingAddress && (
                          <div className="mb-4 p-3 bg-[#1a1f2c] rounded-lg">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Shipping Address
                            </h4>
                            <div className="text-sm text-gray-400">
                              <div>{order.shippingAddress.name}</div>
                              <div>{order.shippingAddress.street}</div>
                              <div>
                                {order.shippingAddress.city}, {order.shippingAddress.district}{" "}
                                {order.shippingAddress.zipCode}
                              </div>
                              <div>{order.shippingAddress.country}</div>
                            </div>
                          </div>
                        )}

                        {/* Payment Information */}
                        {order.payment && (
                          <div className="mb-4 p-3 bg-[#1a1f2c] rounded-lg">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Payment Details
                            </h4>
                            <div className="text-sm text-gray-400">
                              <div>
                                Method:{" "}
                                <span className="capitalize">{order.payment.paymentMethod?.replace("_", " ")}</span>
                              </div>
                              <div>
                                Status:{" "}
                                <span className={getPaymentStatusColor(order.payment.status)}>
                                  {order.payment.status}
                                </span>
                              </div>
                              {order.payment.transactionId && <div>Transaction ID: {order.payment.transactionId}</div>}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-3 pt-4 border-t border-gray-700">
                          <Button variant="outline" size="sm" className="border-gray-600 bg-transparent">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {order.status === "delivered" && (
                            <Button variant="outline" size="sm" className="border-gray-600 bg-transparent">
                              Reorder
                            </Button>
                          )}
                          {canCancelOrder(order) && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                              onClick={() => {
                                setOrderToCancel(order)
                                setShowCancelModal(true)
                              }}
                              disabled={cancellingOrder === order._id}
                            >
                              {cancellingOrder === order._id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                  Cancelling...
                                </>
                              ) : (
                                <>
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel Order
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cancel Order Confirmation Modal */}
            {showCancelModal && orderToCancel && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-[#0f1420] rounded-lg p-6 w-96 border border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-400" />
                    <h3 className="text-lg font-semibold">Cancel Order</h3>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Are you sure you want to cancel order <strong>{orderToCancel.orderNumber}</strong>? This action
                    cannot be undone and the order will be permanently removed from your account.
                  </p>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCancelModal(false)
                        setOrderToCancel(null)
                      }}
                      className="border-gray-600 bg-transparent"
                    >
                      Keep Order
                    </Button>
                    <Button
                      onClick={() => handleCancelOrder(orderToCancel._id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={cancellingOrder === orderToCancel._id}
                    >
                      {cancellingOrder === orderToCancel._id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          Cancelling...
                        </>
                      ) : (
                        "Yes, Cancel Order"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Address Form Modal */}
            {showAddressForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-[#0f1420] rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingAddress._id ? "Edit Address" : "Add New Address"}
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSaveAddress()
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-1">Type</label>
                      <Input
                        value={editingAddress.type}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            type: e.target.value,
                          })
                        }
                        placeholder="Home, Office, etc."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <Input
                        value={editingAddress.name}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            name: e.target.value,
                          })
                        }
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Street</label>
                      <Input
                        value={editingAddress.street}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            street: e.target.value,
                          })
                        }
                        placeholder="Street address"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <Input
                        value={editingAddress.city}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            city: e.target.value,
                          })
                        }
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">District</label>
                      <Input
                        value={editingAddress.district}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            district: e.target.value,
                          })
                        }
                        placeholder="District"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Zip Code</label>
                      <Input
                        value={editingAddress.zipCode}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            zipCode: e.target.value,
                          })
                        }
                        placeholder="Zip code"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Country</label>
                      <Input
                        value={editingAddress.country}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            country: e.target.value,
                          })
                        }
                        placeholder="Country"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={editingAddress.isDefault}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            isDefault: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                      <label htmlFor="isDefault" className="text-sm">
                        Set as default address
                      </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowAddressForm(false)
                          setEditingAddress(null)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-[#d4af37] text-black">
                        Save Address
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
