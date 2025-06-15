"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Filter,
  Star,
  AlertCircle,
} from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        // Fetch order stats
        const orderStatsResponse = await fetch(
          "http://localhost:3000/orders/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!orderStatsResponse.ok) {
          throw new Error("Failed to fetch order statistics");
        }

        const orderStats = await orderStatsResponse.json();

        // Fetch product stats
        const productStatsResponse = await fetch(
          "http://localhost:3000/products/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!productStatsResponse.ok) {
          throw new Error("Failed to fetch product statistics");
        }

        const productStats = await productStatsResponse.json();

        // Fetch users
        const usersResponse = await fetch("http://localhost:3000/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!usersResponse.ok) {
          throw new Error("Failed to fetch users");
        }

        const usersData = await usersResponse.json();

        // Make sure users is an array before using slice
        const usersArray = Array.isArray(usersData)
          ? usersData
          : usersData.users
          ? usersData.users
          : [];

        // Fetch products
        const productsResponse = await fetch(
          "http://localhost:3000/products?limit=4",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }

        const productsData = await productsResponse.json();

        // Update state with fetched data
        setStats({
          totalRevenue: orderStats.totalRevenue || 0,
          totalOrders: orderStats.totalOrders || 0,
          totalCustomers: usersArray.length || 0,
          totalProducts: productStats.totalProducts || 0,
        });

        setRecentOrders(orderStats.recentOrders || []);
        setProducts(productsData.products || []);
        setCustomers(usersArray.slice(0, 3) || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message);
        toast.error(`Failed to load dashboard data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      case "active":
        return "text-green-400 bg-green-900/20";
      case "low stock":
        return "text-orange-400 bg-orange-900/20";
      default:
        return "text-gray-400 bg-gray-900/20";
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "products", label: "Products", icon: Package },
    { id: "customers", label: "Customers", icon: Users },
  ];

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Remove product from state
      setProducts(products.filter((product) => product._id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(`Failed to delete product: ${error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="bg-[#0a0e17] text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto"></div>
          <p className="mt-4">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0a0e17] text-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-[#0f1420] rounded-lg">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#d4af37] hover:bg-[#b8973a] text-black"
          >
            Retry
          </Button>
        </div>
      </div>
    );
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
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="border-gray-600 hover:bg-[#1a1f2c]"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
                <Button
                  onClick={handleLogout}
                  className="bg-[#d4af37] hover:bg-[#b8973a] text-black"
                >
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
              const Icon = tab.icon;
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
              );
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
                      <p className="text-2xl font-bold">
                        Rs.{stats.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-[#d4af37]" />
                  </div>
                </div>

                <div className="bg-[#0f1420] rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Orders</p>
                      <p className="text-2xl font-bold">
                        {stats.totalOrders.toLocaleString()}
                      </p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-[#d4af37]" />
                  </div>
                </div>

                <div className="bg-[#0f1420] rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Customers</p>
                      <p className="text-2xl font-bold">
                        {stats.totalCustomers.toLocaleString()}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-[#d4af37]" />
                  </div>
                </div>

                <div className="bg-[#0f1420] rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Products</p>
                      <p className="text-2xl font-bold">
                        {stats.totalProducts}
                      </p>
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
                    className="border-gray-600"
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
                          <tr
                            key={order._id}
                            className="border-b border-gray-800"
                          >
                            <td className="py-3 px-4 font-medium">
                              {order.orderNumber}
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium">
                                  {order.user?.name || "Unknown"}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {order.user?.email || "No email"}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {order.products?.length || 0} items
                            </td>
                            <td className="py-3 px-4 font-semibold">
                              ${order.totalAmount?.toLocaleString() || 0}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                  order.status
                                )}`}
                              >
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
                                  onClick={() =>
                                    navigate(`/admin/orders/${order._id}`)
                                  }
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  className="text-gray-400 hover:text-[#d4af37]"
                                  onClick={() =>
                                    navigate(`/admin/orders/${order._id}/edit`)
                                  }
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
                          <tr
                            key={order._id}
                            className="border-b border-gray-800 hover:bg-[#1a1f2c]"
                          >
                            <td className="py-3 px-4 font-medium">
                              {order.orderNumber}
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium">
                                  {order.user?.name || "Unknown"}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {order.user?.email || "No email"}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {order.products?.length || 0} items
                            </td>
                            <td className="py-3 px-4 font-semibold">
                              ${order.totalAmount?.toLocaleString() || 0}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                  order.status
                                )}`}
                              >
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
                                  onClick={() =>
                                    navigate(`/admin/orders/${order._id}`)
                                  }
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  className="text-gray-400 hover:text-[#d4af37]"
                                  onClick={() =>
                                    navigate(`/admin/orders/${order._id}/edit`)
                                  }
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
              {/* Product Actions */}
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      className="pl-10 w-80"
                    />
                  </div>
                  <select className="bg-[#1a1f2c] border border-gray-700 rounded px-3 py-2">
                    <option>All Categories</option>
                    <option>Men's</option>
                    <option>Women's</option>
                    <option>Smart</option>
                  </select>
                </div>
                <Button
                  onClick={() => navigate("/dashboard/add-product")}
                  className="bg-[#d4af37] hover:bg-[#b8973a] text-black"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              {/* Products Grid */}
              {products.length === 0 ? (
                <div className="text-center py-16 bg-[#0f1420] rounded-lg">
                  <Package className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-xl font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Start by adding your first product
                  </p>
                  <Button
                    onClick={() => navigate("/admin/add-product")}
                    className="bg-[#d4af37] hover:bg-[#b8973a] text-black"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="bg-[#0f1420] rounded-lg p-6"
                    >
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
                          {product.stock <= 0
                            ? "Out of Stock"
                            : product.stock < 5
                            ? "Low Stock"
                            : "In Stock"}
                        </span>
                        <div className="flex gap-2">
                          <button
                            className="text-gray-400 hover:text-[#d4af37]"
                            onClick={() =>
                              navigate(`/admin/products/${product._id}/edit`)
                            }
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
                          product.mainImage ||
                          product.images?.[0] ||
                          "https://via.placeholder.com/200x200"
                        }
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />

                      <h3 className="font-semibold mb-2">{product.name}</h3>
                      <p className="text-sm text-gray-400 mb-2 capitalize">
                        {product.category}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        <Star className="h-4 w-4 text-[#d4af37] fill-current" />
                        <span className="text-sm">{product.rating || 5.0}</span>
                        <span className="text-sm text-gray-400">
                          ({product.reviews || 0} reviews)
                        </span>
                      </div>

                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-[#d4af37]">
                          Rs.{product.price?.toLocaleString() || 0}
                        </span>
                        <span className="text-sm text-gray-400">
                          Stock: {product.stock || 0}
                        </span>
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
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search customers..."
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <select className="bg-[#1a1f2c] border border-gray-700 rounded px-3 py-2">
                    <option>All Customers</option>
                    <option>Admin</option>
                    <option>User</option>
                  </select>
                  <select className="bg-[#1a1f2c] border border-gray-700 rounded px-3 py-2">
                    <option>Sort by: Name</option>
                    <option>Sort by: Email</option>
                    <option>Sort by: Date Joined</option>
                  </select>
                </div>
              </div>

              {/* Customers Table */}
              <div className="bg-[#0f1420] rounded-lg p-6">
                {customers.length === 0 ? (
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
                        {customers.map((customer) => (
                          <tr
                            key={customer._id}
                            className="border-b border-gray-800 hover:bg-[#1a1f2c]"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#1a1f2c] rounded-full flex items-center justify-center text-sm">
                                  {customer.name?.charAt(0) || "U"}
                                </div>
                                <div className="font-medium">
                                  {customer.name}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-400">
                              {customer.email}
                            </td>
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
                              {new Date(
                                customer.createdAt
                              ).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <button
                                  className="text-gray-400 hover:text-[#d4af37]"
                                  onClick={() =>
                                    navigate(`/admin/users/${customer._id}`)
                                  }
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  className="text-gray-400 hover:text-[#d4af37]"
                                  onClick={() =>
                                    navigate(
                                      `/admin/users/${customer._id}/edit`
                                    )
                                  }
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
  );
};

export default AdminDashboard;
