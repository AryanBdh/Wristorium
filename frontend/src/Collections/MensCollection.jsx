"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Filter, Heart, ShoppingBag, Grid, List } from "lucide-react"
import { Link } from "react-router-dom"
import Button from "../ui/Button"
import Input from "../ui/Input"
import { useCart } from "../context/CartContext"
import watchesData from "../data/watches.json"
import Header from "../Header"
import toast from "react-hot-toast"

const MensCollection = () => {
  const { addToCart } = useCart()

  // Filter only men's watches
  const mensWatches = watchesData.filter((watch) => watch.category === "men")

  // State management
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubCategory, setSelectedSubCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const itemsPerPage = 9

  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")
    return token && user
  }

  // Get unique subcategories for men's watches
  const subCategories = [...new Set(mensWatches.map((watch) => watch.collection))].filter(Boolean)

  // Filter and search logic
  const filteredWatches = useMemo(() => {
    const filtered = mensWatches.filter((watch) => {
      const matchesSearch =
        watch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        watch.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        watch.features.some((feature) => feature.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesSubCategory = selectedSubCategory === "all" || watch.collection === selectedSubCategory
      const matchesPrice = watch.price >= priceRange[0] && watch.price <= priceRange[1]

      return matchesSearch && matchesSubCategory && matchesPrice
    })

    // Sort logic
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default:
        // Featured - keep original order
        break
    }

    return filtered
  }, [searchTerm, selectedSubCategory, priceRange, sortBy, mensWatches])

  // Pagination logic
  const totalPages = Math.ceil(filteredWatches.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedWatches = filteredWatches.slice(startIndex, startIndex + itemsPerPage)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedSubCategory, priceRange, sortBy])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedSubCategory("all")
    setPriceRange([0, 10000])
    setSortBy("featured")
  }

  const handleAddToCart = (e, watch) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn()) {
      toast.error("Please log in to add items to your cart", {
        id: "login-required-cart",
        duration: 4000,
        icon: "🔒",
      })
      return
    }

    addToCart(watch)
    toast.success(`${watch.name} added to cart!`, {
      id: "cart-success",
      duration: 3000,
      icon: "🛒",
    })
  }

  

  // Get min and max prices from men's watches
  const minPrice = Math.min(...mensWatches.map((watch) => watch.price))
  const maxPrice = Math.max(...mensWatches.map((watch) => watch.price))

  return (
    <>
      <Header />
      <div className="bg-[#162337] text-white min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[40vh] overflow-hidden bg-gradient-to-r from-[#0a0e17] via-[#1a1f2c] to-[#0a0e17]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-4xl px-4">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                Men's <span className="text-[#d4af37]">Collection</span>
              </h1>
              <p className="text-xl text-gray-200 mb-6">Discover timepieces crafted for the modern gentleman</p>
              <div className="flex items-center justify-center gap-8 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#d4af37] rounded-full"></div>
                  <span>{mensWatches.length} Watches</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#d4af37] rounded-full"></div>
                  <span>Premium Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#d4af37] rounded-full"></div>
                  <span>Worldwide Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Login Notice for Non-Authenticated Users */}
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

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search and Filter Bar */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
              {/* Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search men's watches..."
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
              <div className="bg-[#0f1420] rounded-lg p-6 mb-6 border border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  

                  {/* Price Range */}
                  <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Price Range: Rs.{priceRange[0]} - Rs.{priceRange[1]}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="range"
                          min={0}
                          max={10000}
                          step="50"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                          className="flex-1"
                        />
                        <input
                          type="range"
                          min={0}
                          max={10000}
                          step="50"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                          className="flex-1"
                        />
                      </div>
                    </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <Button onClick={clearFilters} variant="outline" className="w-full border-gray-600">
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
                {filteredWatches.length} men's watches
              </span>
              {(searchTerm || selectedSubCategory !== "all") && (
                <button onClick={clearFilters} className="text-[#d4af37] hover:underline">
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Products Grid/List */}
          {paginatedWatches.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No men's watches found</h3>
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
              {paginatedWatches.map((watch) => (
                <Link
                  key={watch.id}
                  to={`/product/${watch.id}`}
                  className={`group bg-[#0f1420] rounded-lg overflow-hidden hover:bg-[#1a1f2c] transition-colors border border-gray-800 hover:border-[#d4af37]/30 ${
                    viewMode === "list" ? "flex gap-6" : ""
                  }`}
                >
                  <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                    <img
                      src={watch.image || "/placeholder.svg"}
                      alt={watch.name}
                      className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                        viewMode === "list" ? "w-full h-48" : "w-full aspect-square"
                      }`}
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {watch.isNew && <span className="bg-[#d4af37] text-black text-xs px-2 py-1 rounded">NEW</span>}
                      {watch.isSale && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">SALE</span>}
                    </div>

                    
                  </div>

                  <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg group-hover:text-[#d4af37] transition-colors">
                        {watch.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-[#d4af37]">★</span>
                        <span>{watch.rating}</span>
                        <span className="text-gray-400">({watch.reviews})</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 mb-3 capitalize">{watch.collection} Collection</p>

                    {viewMode === "list" && <p className="text-sm text-gray-300 mb-4">{watch.description}</p>}

                    <div className="flex flex-wrap gap-1 mb-4">
                      {watch.features.slice(0, viewMode === "list" ? 3 : 2).map((feature, index) => (
                        <span key={index} className="text-xs bg-[#1a1f2c] text-gray-300 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-[#d4af37]">Rs.{watch.price.toLocaleString()}</span>
                        {watch.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            Rs.{watch.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={(e) => handleAddToCart(e, watch)}
                        size="sm"
                        className={`bg-[#d4af37] hover:bg-[#b8973a] text-black rounded-none flex items-center gap-2 ${
                          !isLoggedIn() ? "opacity-60" : ""
                        }`}
                        title={!isLoggedIn() ? "Please log in to add to cart" : "Add to cart"}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Add to Cart
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
        </div>
      </div>
    </>
  )
}

export default MensCollection
