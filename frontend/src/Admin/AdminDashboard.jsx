"use client"

import { useState } from "react"
import {
  BarChart3,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Star,
  AlertCircle,
} from "lucide-react"
import Button from "../ui/Button"
import Input from "../ui/Input"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  const stats = {
    totalRevenue: 1250000,
    totalOrders: 3456,
    totalCustomers: 2890,
    totalProducts: 156,
    monthlyGrowth: 12.5,
    orderGrowth: 8.3,
    customerGrowth: 15.2,
    productGrowth: 5.1,
  }

  const recentOrders = [
    {
      id: "WH-2024-001",
      customer: "John Doe",
      email: "john@example.com",
      product: "Artisan Skeleton",
      amount: 2450,
      status: "Processing",
      date: "2024-01-15",
    },
    {
      id: "WH-2024-002",
      customer: "Jane Smith",
      email: "jane@example.com",
      product: "Colonial Rose",
      amount: 1890,
      status: "Shipped",
      date: "2024-01-14",
    },
    {
      id: "WH-2024-003",
      customer: "Mike Johnson",
      email: "mike@example.com",
      product: "Quantum Pro",
      amount: 850,
      status: "Delivered",
      date: "2024-01-13",
    },
  ]

  const products = [
    {
      id: 1,
      name: "Artisan Skeleton",
      category: "Men's",
      price: 2450,
      stock: 12,
      sales: 45,
      rating: 5.0,
      status: "Active",
    },
    {
      id: 2,
      name: "Colonial Rose",
      category: "Women's",
      price: 1890,
      stock: 8,
      sales: 89,
      rating: 4.9,
      status: "Active",
    },
    {
      id: 3,
      name: "Quantum Pro",
      category: "Smart",
      price: 850,
      stock: 25,
      sales: 256,
      rating: 4.7,
      status: "Active",
    },
    {
      id: 4,
      name: "Heritage Gold",
      category: "Men's",
      price: 3200,
      stock: 3,
      sales: 32,
      rating: 4.9,
      status: "Low Stock",
    },
  ]

  const customers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      orders: 5,
      totalSpent: 8950,
      lastOrder: "2024-01-15",
      status: "Premium",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      orders: 3,
      totalSpent: 4200,
      lastOrder: "2024-01-14",
      status: "Regular",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      orders: 8,
      totalSpent: 12500,
      lastOrder: "2024-01-13",
      status: "VIP",
    },
  ]

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-400 bg-green-900/20"
      case "shipped":
        return "text-blue-400 bg-blue-900/20"
      case "processing":
        return "text-yellow-400 bg-yellow-900/20"
      case "cancelled":
        return "text-red-400 bg-red-900/20"
      case "active":
        return "text-green-400 bg-green-900/20"
      case "low stock":
        return "text-orange-400 bg-orange-900/20"
      case "premium":
        return "text-purple-400 bg-purple-900/20"
      case "vip":
        return "text-yellow-400 bg-yellow-900/20"
      default:
        return "text-gray-400 bg-gray-900/20"
    }
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "products", label: "Products", icon: Package },
    { id: "customers", label: "Customers", icon: Users },
  ]

  return (
    <div className="bg-[#0a0e17] text-white min-h-screen">
      {/* Header */}
      <div className="bg-[#0f1420] border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">WHRISTORIUM Management Portal</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap sm:flex-nowrap sm:space-x-1 mb-8 bg-[#0f1420] rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "bg-[#d4af37] text-black" : "text-gray-400 hover:text-white hover:bg-[#1a1f2c]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#0f1420] rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-[#d4af37]" />
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">+{stats.monthlyGrowth}%</span>
                  <span className="text-gray-400 ml-1">from last month</span>
                </div>
              </div>

              <div className="bg-[#0f1420] rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Orders</p>
                    <p className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-[#d4af37]" />
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">+{stats.orderGrowth}%</span>
                  <span className="text-gray-400 ml-1">from last month</span>
                </div>
              </div>

              <div className="bg-[#0f1420] rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Customers</p>
                    <p className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-[#d4af37]" />
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">+{stats.customerGrowth}%</span>
                  <span className="text-gray-400 ml-1">from last month</span>
                </div>
              </div>

              <div className="bg-[#0f1420] rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Products</p>
                    <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  </div>
                  <Package className="h-8 w-8 text-[#d4af37]" />
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">+{stats.productGrowth}%</span>
                  <span className="text-gray-400 ml-1">from last month</span>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-[#0f1420] rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <Button variant="outline" className="border-gray-600">
                  View All Orders
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4">Order ID</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-800">
                        <td className="py-3 px-4 font-medium">{order.id}</td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{order.customer}</div>
                            <div className="text-sm text-gray-400">{order.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{order.product}</td>
                        <td className="py-3 px-4 font-semibold">${order.amount.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400">{order.date}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button className="text-gray-400 hover:text-[#d4af37]">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-[#d4af37]">
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-[#0f1420] rounded-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search orders..." className="pl-10" />
                  </div>
                </div>
                <select className="bg-[#1a1f2c] border border-gray-700 rounded px-3 py-2">
                  <option>All Statuses</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
                <select className="bg-[#1a1f2c] border border-gray-700 rounded px-3 py-2">
                  <option>Last 30 days</option>
                  <option>Last 7 days</option>
                  <option>Last 90 days</option>
                  <option>This year</option>
                </select>
                <Button variant="outline" className="border-gray-600">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#0f1420] rounded-lg p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4">Order ID</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-800 hover:bg-[#1a1f2c]">
                        <td className="py-3 px-4 font-medium">{order.id}</td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{order.customer}</div>
                            <div className="text-sm text-gray-400">{order.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{order.product}</td>
                        <td className="py-3 px-4 font-semibold">${order.amount.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400">{order.date}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button className="text-gray-400 hover:text-[#d4af37]">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-[#d4af37]">
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Product Actions */}
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search products..." className="pl-10 w-80" />
                </div>
                <select className="bg-[#1a1f2c] border border-gray-700 rounded px-3 py-2">
                  <option>All Categories</option>
                  <option>Men's</option>
                  <option>Women's</option>
                  <option>Smart</option>
                </select>
              </div>
              <Button className="bg-[#d4af37] hover:bg-[#b8973a] text-black">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-[#0f1420] rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-[#d4af37]">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <img
                    src="https://via.placeholder.com/200x200"
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />

                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">{product.category}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-4 w-4 text-[#d4af37] fill-current" />
                    <span className="text-sm">{product.rating}</span>
                    <span className="text-sm text-gray-400">({product.sales} sales)</span>
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-[#d4af37]">${product.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-400">Stock: {product.stock}</span>
                  </div>

                  {product.stock <= 5 && (
                    <div className="flex items-center gap-2 text-orange-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      Low stock warning
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === "customers" && (
          <div className="space-y-6">
            {/* Customer Filters */}
            <div className="bg-[#0f1420] rounded-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search customers..." className="pl-10" />
                  </div>
                </div>
                <select className="bg-[#1a1f2c] border border-gray-700 rounded px-3 py-2">
                  <option>All Customers</option>
                  <option>VIP</option>
                  <option>Premium</option>
                  <option>Regular</option>
                </select>
                <select className="bg-[#1a1f2c] border border-gray-700 rounded px-3 py-2">
                  <option>Sort by: Name</option>
                  <option>Sort by: Orders</option>
                  <option>Sort by: Total Spent</option>
                  <option>Sort by: Last Order</option>
                </select>
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-[#0f1420] rounded-lg p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Orders</th>
                      <th className="text-left py-3 px-4">Total Spent</th>
                      <th className="text-left py-3 px-4">Last Order</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id} className="border-b border-gray-800 hover:bg-[#1a1f2c]">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-400">{customer.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{customer.orders}</td>
                        <td className="py-3 px-4 font-semibold">${customer.totalSpent.toLocaleString()}</td>
                        <td className="py-3 px-4 text-gray-400">{customer.lastOrder}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(customer.status)}`}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button className="text-gray-400 hover:text-[#d4af37]">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-[#d4af37]">
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
