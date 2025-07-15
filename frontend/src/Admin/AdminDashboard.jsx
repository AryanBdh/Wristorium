"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  BarChart3,
  Users,
  Package,
  DollarSign,
  Home,
  ShoppingCart,
  Eye,
  Edit,
  Trash2,
  Plus,
  LogOut,
  Search,
  Star,
  AlertCircle,
  X,
} from "lucide-react"
import Button from "../ui/Button"
import Input from "../ui/Input"
import toast from "react-hot-toast"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // State for data
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    monthlyGrowth: 0,
    orderGrowth: 0,
    customerGrowth: 0,
    productGrowth: 0,
  })

  const [recentOrders, setRecentOrders] = useState([])
  const [allOrders, setAllOrders] = useState([])
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [allCustomers, setAllCustomers] = useState([])

  // Search and filter states
  const [searchQueries, setSearchQueries] = useState({
    orders: "",
    products: "",
    customers: "",
  })

  const [filters, setFilters] = useState({
    orders: {
      status: "",
      dateRange: "",
    },
    products: {
      category: "",
      stock: "",
    },
    customers: {
      role: "",
      sortBy: "",
    },
  })

  const [filteredData, setFilteredData] = useState({
    orders: [],
    products: [],
    customers: [],
  })

  // Loading states for different operations
  const [loadingStates, setLoadingStates] = useState({
    orders: false,
    products: false,
    customers: false,
  })

  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication token not found")
        }

        // Fetch order stats
        const orderStatsResponse = await fetch("http://localhost:5000/api/orders/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!orderStatsResponse.ok) {
          throw new Error("Failed to fetch order statistics")
        }

        const orderStats = await orderStatsResponse.json()

        // Fetch product stats
        const productStatsResponse = await fetch("http://localhost:5000/api/products/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!productStatsResponse.ok) {
          throw new Error("Failed to fetch product statistics")
        }

        const productStats = await productStatsResponse.json()

        // Fetch users
        const usersResponse = await fetch("http://localhost:5000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!usersResponse.ok) {
          throw new Error("Failed to fetch users")
        }

        const usersData = await usersResponse.json()
        const usersArray = Array.isArray(usersData) ? usersData : usersData.users ? usersData.users : []

        // Fetch all orders
        const allOrdersResponse = await fetch("http://localhost:5000/api/orders?limit=100", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!allOrdersResponse.ok) {
          throw new Error("Failed to fetch all orders")
        }

        const allOrdersData = await allOrdersResponse.json()

        // Fetch all products
        const allProductsResponse = await fetch("http://localhost:5000/api/products?limit=100", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!allProductsResponse.ok) {
          throw new Error("Failed to fetch all products")
        }

        const allProductsData = await allProductsResponse.json()

        // Update state with fetched data
        setStats({
          totalRevenue: orderStats.totalRevenue || 0,
          totalOrders: orderStats.totalOrders || 0,
          totalCustomers: usersArray.length || 0,
          totalProducts: productStats.totalProducts || 0,
        })

        setRecentOrders(orderStats.recentOrders || [])
        setAllOrders(allOrdersData.orders || [])
        setProducts(allProductsData.products?.slice(0, 8) || [])
        setAllProducts(allProductsData.products || [])
        setCustomers(usersArray.slice(0, 10) || [])
        setAllCustomers(usersArray || [])

        // Initialize filtered data
        setFilteredData({
          orders: allOrdersData.orders || [],
          products: allProductsData.products || [],
          customers: usersArray || [],
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError(error.message)
        toast.error(`Failed to load dashboard data: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Search and filter functions
  useEffect(() => {
    applyFilters()
  }, [searchQueries, filters, allOrders, allProducts, allCustomers])

  const applyFilters = () => {
    // Filter Orders
    let filteredOrders = [...allOrders]

    if (searchQueries.orders) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.orderNumber?.toLowerCase().includes(searchQueries.orders.toLowerCase()) ||
          order.user?.name?.toLowerCase().includes(searchQueries.orders.toLowerCase()) ||
          order.user?.email?.toLowerCase().includes(searchQueries.orders.toLowerCase()),
      )
    }

    if (filters.orders.status) {
      filteredOrders = filteredOrders.filter((order) => order.status === filters.orders.status)
    }

    if (filters.orders.dateRange) {
      const now = new Date()
      let dateFilter

      switch (filters.orders.dateRange) {
        case "7days":
          dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case "30days":
          dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case "90days":
          dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        case "year":
          dateFilter = new Date(now.getFullYear(), 0, 1)
          break
        default:
          dateFilter = null
      }

      if (dateFilter) {
        filteredOrders = filteredOrders.filter((order) => new Date(order.createdAt) >= dateFilter)
      }
    }

    // Filter Products
    let filteredProducts = [...allProducts]

    if (searchQueries.products) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchQueries.products.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQueries.products.toLowerCase()) ||
          product.collection?.toLowerCase().includes(searchQueries.products.toLowerCase()),
      )
    }

    if (filters.products.category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category?.toLowerCase() === filters.products.category.toLowerCase(),
      )
    }

    if (filters.products.stock) {
      switch (filters.products.stock) {
        case "in_stock":
          filteredProducts = filteredProducts.filter((product) => product.stock > 5)
          break
        case "low_stock":
          filteredProducts = filteredProducts.filter((product) => product.stock > 0 && product.stock <= 5)
          break
        case "out_of_stock":
          filteredProducts = filteredProducts.filter((product) => product.stock === 0)
          break
      }
    }

    // Filter Customers
    let filteredCustomers = [...allCustomers]

    if (searchQueries.customers) {
      filteredCustomers = filteredCustomers.filter(
        (customer) =>
          customer.name?.toLowerCase().includes(searchQueries.customers.toLowerCase()) ||
          customer.email?.toLowerCase().includes(searchQueries.customers.toLowerCase()),
      )
    }

    if (filters.customers.role) {
      filteredCustomers = filteredCustomers.filter((customer) => customer.role === filters.customers.role)
    }

    if (filters.customers.sortBy) {
      switch (filters.customers.sortBy) {
        case "name":
          filteredCustomers.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
          break
        case "email":
          filteredCustomers.sort((a, b) => (a.email || "").localeCompare(b.email || ""))
          break
        case "date":
          filteredCustomers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          break
      }
    }

    setFilteredData({
      orders: filteredOrders,
      products: filteredProducts,
      customers: filteredCustomers,
    })
  }

  const handleSearchChange = (tab, value) => {
    setSearchQueries((prev) => ({
      ...prev,
      [tab]: value,
    }))
  }

  const handleFilterChange = (tab, filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [filterType]: value,
      },
    }))
  }

  const clearFilters = (tab) => {
    setSearchQueries((prev) => ({
      ...prev,
      [tab]: "",
    }))

    setFilters((prev) => ({
      ...prev,
      [tab]:
        tab === "orders"
          ? { status: "", dateRange: "" }
          : tab === "products"
            ? { category: "", stock: "" }
            : { role: "", sortBy: "" },
    }))
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      // Remove product from both products and allProducts state
      setProducts(products.filter((product) => product._id !== productId))
      setAllProducts(allProducts.filter((product) => product._id !== productId))
      toast.success("Product deleted successfully")
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error(`Failed to delete product: ${error.message}`)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged out successfully")
    navigate("/")
  }

  if (isLoading) {
    return (
      <div className="bg-[#0a0e17] text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto"></div>
          <p className="mt-4">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#0a0e17] text-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-[#0f1420] rounded-lg">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-[#d4af37] hover:bg-[#b8973a] text-black">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-[#162337] text-white min-h-screen">
        {/* Header */}
        <div className="bg-[#0f1420] border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-gray-400">WHRISTORIUM Management Portal</p>
              </div>
              <div className="flex space-x-4">
                <Button onClick={() => navigate("/")} variant="outline" className="border-gray-600 hover:bg-[#1a1f2c]">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
                <Button onClick={handleLogout} className="bg-[#d4af37] hover:bg-[#b8973a] text-black">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap sm:flex-nowrap sm:space-x-1 mb-8 bg-[#0f1420] rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#d4af37] text-black"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1f2c]"
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
                      <p className="text-2xl font-bold">Rs.{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-[#d4af37]" />
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
                </div>

                <div className="bg-[#0f1420] rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Customers</p>
                      <p className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-[#d4af37]" />
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
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-[#0f1420] rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Recent Orders</h2>
                  <Button
                    variant="outline"
                    className="border-gray-600 bg-transparent"
                    onClick={() => setActiveTab("orders")}
                  >
                    View All Orders
                  </Button>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No orders found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4">Order ID</th>
                          <th className="text-left py-3 px-4">Customer</th>
                          <th className="text-left py-3 px-4">Products</th>
                          <th className="text-left py-3 px-4">Amount</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order._id} className="border-b border-gray-800">
                            <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium">{order.user?.name || "Unknown"}</div>
                                <div className="text-sm text-gray-400">{order.user?.email || "No email"}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{order.products?.length || 0} items</td>
                            <td className="py-3 px-4 font-semibold">Rs.{order.totalAmount?.toLocaleString() || 0}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                                {order.status || "Unknown"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <button
                                  className="text-gray-400 hover:text-[#d4af37]"
                                  onClick={() => navigate(`/dashboard/orders/${order._id}`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  className="text-gray-400 hover:text-[#d4af37]"
                                  onClick={() => navigate(`/dashboard/orders/${order._id}/edit`)}
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-[#0f1420] rounded-lg p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search orders by ID, customer name, or email..."
                        className="pl-10"
                        value={searchQueries.orders}
                        onChange={(e) => handleSearchChange("orders", e.target.value)}
                      />
                    </div>
                  </div>
                  <select
                    className="bg-[#1a1f2c] border border-gray-700 rounded px-3 py-2"
                    value={filters.orders.status}
                    onChange={(e) => handleFilterChange("orders", "status", e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select
                    className="bg-[#1a1f2c] border border-gray-700 rounded px-3 py-2"
                    value={filters.orders.dateRange}
                    onChange={(e) => handleFilterChange("orders", "dateRange", e.target.value)}
                  >
                    <option value="">All Time</option>
                    <option value="7days">Last 7 days</option>
                    <option value="30days">Last 30 days</option>
                    <option value="90days">Last 90 days</option>
                    <option value="year">This year</option>
                  </select>
                  <Button
                    variant="outline"
                    className="border-gray-600 bg-transparent"
                    onClick={() => clearFilters("orders")}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  Showing {filteredData.orders.length} of {allOrders.length} orders
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-[#0f1420] rounded-lg p-6">
                {filteredData.orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No orders found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4">Order ID</th>
                          <th className="text-left py-3 px-4">Customer</th>
                          <th className="text-left py-3 px-4">Products</th>
                          <th className="text-left py-3 px-4">Amount</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Payment</th>
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.orders.map((order) => (
                          <tr key={order._id} className="border-b border-gray-800 hover:bg-[#1a1f2c]">
                            <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium">{order.user?.name || "Unknown"}</div>
                                <div className="text-sm text-gray-400">{order.user?.email || "No email"}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{order.products?.length || 0} items</td>
                            <td className="py-3 px-4 font-semibold">Rs.{order.totalAmount?.toLocaleString() || 0}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                                {order.status || "Unknown"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.paymentStatus)}`}>
                                {order.paymentStatus || "Unknown"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <button
                                  className="text-gray-400 hover:text-[#d4af37]"
                                  onClick={() => navigate(`/dashboard/orders/${order._id}`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  className="text-gray-400 hover:text-[#d4af37]"
                                  onClick={() => navigate(`/dashboard/orders/${order._id}/edit`)}
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="space-y-6">
              {/* Product Filters */}
              <div className="bg-[#0f1420] rounded-lg p-6">
                <div className="flex flex-col lg:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search products by name, category, or collection..."
                        className="pl-10"
                        value={searchQueries.products}
                        onChange={(e) => handleSearchChange("products", e.target.value)}
                      />
                    </div>
                  </div>
                  <select
                    className="bg-[#1a1f2c] border border-gray-700 rounded px-3 py-2"
                    value={filters.products.category}
                    onChange={(e) => handleFilterChange("products", "category", e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="men">Men's</option>
                    <option value="women">Women's</option>
                    <option value="smart">Smart</option>
                  </select>
                  <select
                    className="bg-[#1a1f2c] border border-gray-700 rounded px-3 py-2"
                    value={filters.products.stock}
                    onChange={(e) => handleFilterChange("products", "stock", e.target.value)}
                  >
                    <option value="">All Stock Levels</option>
                    <option value="in_stock">In Stock (5+)</option>
                    <option value="low_stock">Low Stock (1-5)</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                  <Button
                    variant="outline"
                    className="border-gray-600 bg-transparent"
                    onClick={() => clearFilters("products")}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    Showing {filteredData.products.length} of {allProducts.length} products
                  </div>
                  <Button
                    onClick={() => navigate("/dashboard/add-product")}
                    className="bg-[#d4af37] hover:bg-[#b8973a] text-black"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </div>

              {/* Products Grid */}
              {filteredData.products.length === 0 ? (
                <div className="text-center py-16 bg-[#0f1420] rounded-lg">
                  <Package className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-gray-400 mb-6">
                    {searchQueries.products || filters.products.category || filters.products.stock
                      ? "Try adjusting your search or filters"
                      : "Start by adding your first product"}
                  </p>
                  {!searchQueries.products && !filters.products.category && !filters.products.stock && (
                    <Button
                      onClick={() => navigate("/admin/add-product")}
                      className="bg-[#d4af37] hover:bg-[#b8973a] text-black"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredData.products.map((product) => (
                    <div key={product._id} className="bg-[#0f1420] rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            product.stock <= 0
                              ? "bg-red-900/20 text-red-400"
                              : product.stock < 5
                                ? "bg-orange-900/20 text-orange-400"
                                : "bg-green-900/20 text-green-400"
                          }`}
                        >
                          {product.stock <= 0 ? "Out of Stock" : product.stock < 5 ? "Low Stock" : "In Stock"}
                        </span>
                        <div className="flex gap-2">
                          <button
                            className="text-gray-400 hover:text-[#d4af37]"
                            onClick={() => navigate(`/dashboard/products/${product._id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="text-gray-400 hover:text-red-400"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <img
                        src={
                          product.mainImage?.startsWith("http")
                            ? product.mainImage
                            : product.mainImage
                              ? `http://localhost:5000/products/${product.mainImage}`
                              : product.images?.[0]?.startsWith("http")
                                ? product.images[0]
                                : product.images?.[0]
                                  ? `http://localhost:5000/products/${product.images[0]}`
                                  : "/placeholder.svg?height=200&width=200"
                        }
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=200&width=200"
                        }}
                      />

                      <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-gray-400 mb-2 capitalize">
                        {product.category} • {product.collection}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        <Star className="h-4 w-4 text-[#d4af37] fill-current" />
                        <span className="text-sm">{product.rating || 5.0}</span>
                        <span className="text-sm text-gray-400">({product.reviews || 0} reviews)</span>
                      </div>

                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-[#d4af37]">
                              Rs.{(product.price || 0).toLocaleString()}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                Rs.{product.originalPrice?.toLocaleString()}
                              </span>
                            )}
                          </div>
                        <span className="text-sm text-gray-400">Stock: {product.stock || 0}</span>
                      </div>

                      {product.stock <= 5 && product.stock > 0 && (
                        <div className="flex items-center gap-2 text-orange-400 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          Low stock warning
                        </div>
                      )}

                      {product.stock <= 0 && (
                        <div className="flex items-center gap-2 text-red-400 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          Out of stock
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === "customers" && (
            <div className="space-y-6">
              {/* Customer Filters */}
              <div className="bg-[#0f1420] rounded-lg p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search customers by name or email..."
                        className="pl-10"
                        value={searchQueries.customers}
                        onChange={(e) => handleSearchChange("customers", e.target.value)}
                      />
                    </div>
                  </div>
                  <select
                    className="bg-[#1a1f2c] border border-gray-700 rounded px-3 py-2"
                    value={filters.customers.role}
                    onChange={(e) => handleFilterChange("customers", "role", e.target.value)}
                  >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                  <select
                    className="bg-[#1a1f2c] border border-gray-700 rounded px-3 py-2"
                    value={filters.customers.sortBy}
                    onChange={(e) => handleFilterChange("customers", "sortBy", e.target.value)}
                  >
                    <option value="">Sort by: Default</option>
                    <option value="name">Sort by: Name</option>
                    <option value="email">Sort by: Email</option>
                    <option value="date">Sort by: Date Joined</option>
                  </select>
                  <Button
                    variant="outline"
                    className="border-gray-600 bg-transparent"
                    onClick={() => clearFilters("customers")}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  Showing {filteredData.customers.length} of {allCustomers.length} customers
                </div>
              </div>

              {/* Customers Table */}
              <div className="bg-[#0f1420] rounded-lg p-6">
                {filteredData.customers.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No customers found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4">Customer</th>
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">Role</th>
                          <th className="text-left py-3 px-4">Date Joined</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.customers.map((customer) => (
                          <tr key={customer._id} className="border-b border-gray-800 hover:bg-[#1a1f2c]">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {customer.image ? (
                                  <img
                                    src={`http://localhost:5000/users/${customer.image}`}
                                    alt={customer.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = "none"
                                      e.target.nextSibling.style.display = "flex"
                                    }}
                                  />
                                ) : null}
                                <div
                                  className={`w-8 h-8 bg-[#1a1f2c] rounded-full flex items-center justify-center text-sm ${
                                    customer.image ? "hidden" : "flex"
                                  }`}
                                >
                                  {customer.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                                <div className="font-medium">{customer.name || "Unknown User"}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-400">{customer.email}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  customer.role === "admin"
                                    ? "bg-purple-900/20 text-purple-400"
                                    : "bg-blue-900/20 text-blue-400"
                                }`}
                              >
                                {customer.role || "user"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-400">
                              {new Date(customer.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <button
                                  className="text-gray-400 hover:text-[#d4af37]"
                                  onClick={() => navigate(`/admin/users/${customer._id}`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  className="text-gray-400 hover:text-[#d4af37]"
                                  onClick={() => navigate(`/admin/users/${customer._id}/edit`)}
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminDashboard
