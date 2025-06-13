"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { User, Mail, Phone, MapPin, Package, Heart, Settings, Shield, Edit, Save, X, Eye, Star } from "lucide-react"
import Button from "../../ui/Button"
import Input from "../../ui/Input"
import toast from "react-hot-toast"

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "abc@example.com",
    phone: "",
    dateOfBirth: "",
    memberSince: "",
  })

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      name: "John Doe",
      street: "123 Luxury Avenue",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      isDefault: true,
    },
    {
      id: 2,
      type: "Office",
      name: "John Doe",
      street: "456 Business Plaza",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      country: "United States",
      isDefault: false,
    },
  ])

  const [orders] = useState([
    {
      id: "WH-2024-001",
      date: "2024-01-15",
      status: "Delivered",
      total: 2450,
      items: [{ name: "Artisan Skeleton", price: 2450, quantity: 1, image: "https://via.placeholder.com/80x80" }],
    },
    {
      id: "WH-2024-002",
      date: "2024-01-08",
      status: "Shipped",
      total: 1890,
      items: [{ name: "Colonial Rose", price: 1890, quantity: 1, image: "https://via.placeholder.com/80x80" }],
    },
    {
      id: "WH-2024-003",
      date: "2023-12-20",
      status: "Delivered",
      total: 1250,
      items: [{ name: "Sovereign Classic", price: 1250, quantity: 1, image: "https://via.placeholder.com/80x80" }],
    },
  ])

  const handleSaveProfile = () => {
    // Here you would typically save to your backend
    setIsEditing(false)
    toast.success("Profile updated successfully", {
      icon: "✅",
      id: "profile-update",
    })
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    // Reset any changes
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-400"
      case "shipped":
        return "text-blue-400"
      case "processing":
        return "text-yellow-400"
      case "cancelled":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings },
  ]

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
            <div className="text-right">
              <div className="text-sm text-gray-400">Member since</div>
              <div className="text-[#d4af37] font-semibold">January 2023</div>
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
                  <h3 className="font-semibold">
                    {profileData.firstName} {profileData.lastName}
                  </h3>
                  <p className="text-sm text-gray-400">Premium Member</p>
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
                        <Button onClick={handleCancelEdit} variant="outline" size="sm" className="border-gray-600">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <Input
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-[#1a1f2c] border-gray-700" : ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <Input
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-[#1a1f2c] border-gray-700" : ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-[#1a1f2c] border-gray-700" : ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-[#1a1f2c] border-gray-700" : ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Date of Birth</label>
                      <Input
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-[#1a1f2c] border-gray-700" : ""}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#0f1420] rounded-lg p-6 text-center">
                    <Package className="h-8 w-8 text-[#d4af37] mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">{orders.length}</div>
                    <div className="text-sm text-gray-400">Total Orders</div>
                  </div>
                  <div className="bg-[#0f1420] rounded-lg p-6 text-center">
                    <Heart className="h-8 w-8 text-[#d4af37] mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">12</div>
                    <div className="text-sm text-gray-400">Favorites</div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-[#0f1420] rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Recent Orders</h2>
                    <Link to="/orders" className="text-[#d4af37] hover:underline text-sm">
                      View All Orders →
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-[#1a1f2c] rounded-lg">
                        <div className="flex items-center gap-4">
                          <img
                            src={order.items[0].image || "/placeholder.svg"}
                            alt={order.items[0].name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <div className="font-medium">{order.id}</div>
                            <div className="text-sm text-gray-400">{order.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${order.total.toLocaleString()}</div>
                          <div className={`text-sm ${getStatusColor(order.status)}`}>{order.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-[#0f1420] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Order History</h2>

                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">Order {order.id}</h3>
                          <p className="text-sm text-gray-400">Placed on {order.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${order.total.toLocaleString()}</div>
                          <div className={`text-sm ${getStatusColor(order.status)}`}>{order.status}</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-16 h-16 rounded object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">${item.price.toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-700">
                        <Button variant="outline" size="sm" className="border-gray-600">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {order.status === "Delivered" && (
                          <Button variant="outline" size="sm" className="border-gray-600">
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="bg-[#0f1420] rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Saved Addresses</h2>
                  <Button className="bg-[#d4af37] hover:bg-[#b8973a] text-black">Add New Address</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <div key={address.id} className="border border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{address.type}</h3>
                          {address.isDefault && (
                            <span className="bg-[#d4af37] text-black text-xs px-2 py-1 rounded">Default</span>
                          )}
                        </div>
                        <Button variant="outline" size="sm" className="border-gray-600">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-sm space-y-1">
                        <div className="font-medium">{address.name}</div>
                        <div className="text-gray-400">{address.street}</div>
                        <div className="text-gray-400">
                          {address.city}, {address.state} {address.zipCode}
                        </div>
                        <div className="text-gray-400">{address.country}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                {/* Account Security */}
                <div className="bg-[#0f1420] rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-6">Account Security</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#1a1f2c] rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-[#d4af37]" />
                        <div>
                          <div className="font-medium">Password</div>
                          <div className="text-sm text-gray-400">Last changed 3 months ago</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-600">
                        Change Password
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#1a1f2c] rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-[#d4af37]" />
                        <div>
                          <div className="font-medium">Email Verification</div>
                          <div className="text-sm text-green-400">Verified</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-600">
                        Update Email
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#1a1f2c] rounded-lg">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-[#d4af37]" />
                        <div>
                          <div className="font-medium">Two-Factor Authentication</div>
                          <div className="text-sm text-gray-400">Not enabled</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-600">
                        Enable 2FA
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="bg-[#0f1420] rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-6">Preferences</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-gray-400">Receive updates about orders and promotions</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">SMS Notifications</div>
                        <div className="text-sm text-gray-400">Receive shipping updates via SMS</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Marketing Communications</div>
                        <div className="text-sm text-gray-400">
                          Receive exclusive offers and new product announcements
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-[#0f1420] rounded-lg p-6 border border-red-900/20">
                  <h2 className="text-xl font-semibold mb-6 text-red-400">Danger Zone</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-red-900/10 rounded-lg border border-red-900/20">
                      <div>
                        <div className="font-medium text-red-400">Delete Account</div>
                        <div className="text-sm text-gray-400">Permanently delete your account and all data</div>
                      </div>
                      <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-900/20">
                        Delete Account
                      </Button>
                    </div>
                  </div>
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
