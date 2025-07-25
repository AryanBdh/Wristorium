"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Filter, ShoppingBag, Grid, List } from "lucide-react"
import { Link } from "react-router-dom"
import Button from "../ui/Button"
import Input from "../ui/Input"
import { useCart } from "../context/CartContext"
import watchesData from "../data/watches.json"
import Header from "../Header"
import toast from "react-hot-toast"

const Shop = () => {
  const { addToCart, isLoading: cartLoading, isLoaded: cartLoaded } = useCart()

  // State management
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataSource, setDataSource] = useState("static")

  const itemsPerPage = 9

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        console.log("🔄 Fetching products from API...")

        const response = await fetch("http://localhost:5000/api/products")

        if (response.ok) {
          const data = await response.json()
          console.log("✅ API Response:", data)

          // Check different possible response structures
          if (data.products && Array.isArray(data.products) && data.products.length > 0) {
            setProducts(data.products)
            setDataSource("database")
            console.log("✅ Using database products:", data.products.length)
          } else if (Array.isArray(data) && data.length > 0) {
            setProducts(data)
            setDataSource("database")
            console.log("✅ Using database products (direct array):", data.length)
          } else {
            throw new Error("No products found in database response")
          }
        } else {
          throw new Error(`API request failed: ${response.status}`)
        }
      } catch (error) {
        console.error("❌ Error fetching products:", error)
        setError(error.message)

        // Fallback to static data
        console.log("📦 Using static data fallback")
        setProducts(watchesData)
        setDataSource("static")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")
    return token && user
  }

  // Filter and search logic
  const filteredWatches = useMemo(() => {
    const filtered = products.filter((watch) => {
      const matchesSearch =
        watch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        watch.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (watch.features && watch.features.some((feature) => feature.toLowerCase().includes(searchTerm.toLowerCase())))

      const matchesCategory = selectedCategory === "all" || watch.category === selectedCategory
      const matchesPrice = watch.price >= priceRange[0] && watch.price <= priceRange[1]

      return matchesSearch && matchesCategory && matchesPrice
    })

    // Sort logic
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case "name":
        filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        break
      case "rating":
        filtered.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5))
        break
      case "newest":
        filtered.sort((a, b) => (b.isNewProduct ? 1 : 0) - (a.isNewProduct ? 1 : 0))
        break
      default:
        break
    }

    return filtered
  }, [searchTerm, selectedCategory, priceRange, sortBy, products])

  // Pagination logic
  const totalPages = Math.ceil(filteredWatches.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedWatches = filteredWatches.slice(startIndex, startIndex + itemsPerPage)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, priceRange, sortBy])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setPriceRange([0, 50000])
    setSortBy("featured")
  }

  const handleAddToCart = async (e, watch) => {
    e.preventDefault()
    e.stopPropagation()

    if (!cartLoaded) {
      toast.error("Please wait, cart is loading...")
      return
    }

    if (!isLoggedIn()) {
      toast.error("Please log in to add items to your cart", {
        id: "login-required-cart",
        duration: 4000,
      })
      return
    }

    console.log("🛒 Adding product to cart:", watch)
    const success = await addToCart(watch, 1)

    if (success) {
      console.log("✅ Successfully added to cart")
    } else {
      console.log("❌ Failed to add to cart")
    }
  }

  // Get product image URL
  const getProductImageUrl = (product) => {
    if (dataSource === "database") {
      // Database product
      if (product.mainImage) {
        // Check if it's already a full URL
        if (product.mainImage.startsWith("http")) {
          return product.mainImage
        }
        // Construct URL for uploaded image
        return `http://localhost:5000/products/${product.mainImage}`
      }
      // Fallback for database products
      return "/placeholder.svg?height=300&width=300"
    } else {
      // Static product
      return product.image || "/placeholder.svg?height=300&width=300"
    }
  }

  // Get unique categories
  const categories = ["all", ...new Set(products.map((product) => product.category).filter(Boolean))]

  return (
    <>
      <Header />
      <div className="bg-[#162337] text-white min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[30vh] overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-3xl px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Timepieces</h1>
              <p className="text-lg text-gray-200">Discover our complete collection of luxury watches</p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {!isLoggedIn() && (
            <div className="mb-6 p-4 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#d4af37] rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">!</span>
                </div>
                <div>
                  <p className="text-[#d4af37] font-medium">Sign in to unlock full features</p>
                  <p className="text-sm text-gray-300">
                    <Link to="/login" className="text-[#d4af37] hover:underline">
                      Log in
                    </Link>{" "}
                    or{" "}
                    <Link to="/register" className="text-[#d4af37] hover:underline">
                      create an account
                    </Link>{" "}
                    to add items to your cart.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37]"></div>
              <span className="ml-4 text-lg">Loading products...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
              <p className="text-red-400">Error loading products: {error}</p>
              <p className="text-sm text-gray-300 mt-2">Showing static products instead.</p>
            </div>
          )}

          {/* Search and Filter Bar */}
          {!loading && (
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
                {/* Search */}
                <div className="relative w-full lg:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search watches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>

                {/* View Toggle and Sort */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-600 rounded">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${viewMode === "grid" ? "bg-[#d4af37] text-black" : "text-gray-400"}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${viewMode === "list" ? "bg-[#d4af37] text-black" : "text-gray-400"}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#1a1f2c] border border-gray-700 rounded px-3 py-2 text-sm"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name A-Z</option>
                    <option value="rating">Highest Rated</option>
                  </select>

                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    className="border-gray-600 hover:bg-gray-800"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="bg-[#0f1420] rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-[#1a1f2c] border border-gray-700 rounded px-3 py-2 text-sm"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category === "all"
                              ? "All Categories"
                              : category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Price Range: Rs.{priceRange[0]} - Rs.{priceRange[1]}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="range"
                          min={0}
                          max={50000}
                          step="50"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                          className="flex-1"
                        />
                        <input
                          type="range"
                          min={0}
                          max={50000}
                          step="50"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                      <Button
                        onClick={clearFilters}
                        variant="outline"
                        className="w-full border-gray-600 bg-transparent"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Info */}
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredWatches.length)} of{" "}
                  {filteredWatches.length} results
                </span>
                {(searchTerm || selectedCategory !== "all") && (
                  <button onClick={clearFilters} className="text-[#d4af37] hover:underline">
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Products Grid/List */}
          {!loading && (
            <>
              {paginatedWatches.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-semibold mb-2">No watches found</h3>
                  <p className="text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
                  <Button onClick={clearFilters} className="bg-[#d4af37] hover:bg-[#b8973a] text-black">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" : "space-y-6 mb-8"
                  }
                >
                  {paginatedWatches.map((product) => (
                    <Link
                      key={product._id || product.id}
                      to={`/product/${product._id || product.id}`}
                      className={`group bg-[#0f1420] rounded-lg overflow-hidden hover:bg-[#1a1f2c] transition-colors ${
                        viewMode === "list" ? "flex gap-6" : ""
                      }`}
                    >
                      <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                        <img
                          src={getProductImageUrl(product) || "/placeholder.svg"}
                          alt={product.name}
                          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                            viewMode === "list" ? "w-full h-48" : "w-full aspect-square"
                          }`}
                          onError={(e) => {
                            console.log("❌ Image failed to load:", e.target.src)
                            e.target.src = "/placeholder.svg?height=300&width=300"
                          }}
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          {product.isNewProduct && (
                            <span className="bg-[#d4af37] text-black text-xs px-2 py-1 rounded">NEW</span>
                          )}
                          {product.isSale && (
                            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">SALE</span>
                          )}                         
                        </div>
                      </div>

                      <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg group-hover:text-[#d4af37] transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-[#d4af37]">★</span>
                            <span>{product.rating || 4.5}</span>
                            <span className="text-gray-400">({product.reviews || 0})</span>
                          </div>
                        </div>

                        {viewMode === "list" && product.description && (
                          <p className="text-sm text-gray-300 mb-4">{product.description}</p>
                        )}

                        <div className="flex flex-wrap gap-1 mb-4">
                          {(product.features || []).slice(0, viewMode === "list" ? 3 : 2).map((feature, index) => (
                            <span key={index} className="text-xs bg-[#1a1f2c] text-gray-300 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
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
                          <Button
                            onClick={(e) => handleAddToCart(e, product)}
                            size="sm"
                            disabled={!cartLoaded || cartLoading || !isLoggedIn()}
                            className={`bg-[#d4af37] hover:bg-[#b8973a] text-black rounded-none flex items-center gap-2 ${
                              !isLoggedIn() || !cartLoaded || cartLoading ? "opacity-60 cursor-not-allowed" : ""
                            }`}
                            title={!isLoggedIn() ? "Please log in to add to cart" : "Add to cart"}
                          >
                            <ShoppingBag className="h-4 w-4" />
                            {cartLoading ? "..." : "Add to Cart"}
                          </Button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="border-gray-600"
                  >
                    Previous
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={currentPage === page ? "default" : "outline"}
                      className={currentPage === page ? "bg-[#d4af37] text-black" : "border-gray-600 hover:bg-gray-800"}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="border-gray-600"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}

          
        </div>
      </div>
    </>
  )
}

export default Shop
