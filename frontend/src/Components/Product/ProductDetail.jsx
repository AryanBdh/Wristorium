"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import {
  Heart,
  ShoppingBag,
  Star,
  Shield,
  Truck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Share2,
} from "lucide-react"
import Button from "../../ui/Button"
import { useCart } from "../../context/CartContext"
import { useFavorites } from "../../context/FavouritesContext"
import Header from "../../Header"
import toast from "react-hot-toast"

const ProductDetail = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")

  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")
    return token && user
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("Fetching product with ID:", id)

        // Try to fetch from database first
        const productResponse = await fetch(`http://localhost:3000/products/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        console.log("Product response status:", productResponse.status)

        if (productResponse.ok) {
          const productData = await productResponse.json()
          console.log("✅ Successfully fetched product from database:", productData)
          setProduct(productData)

          // Fetch related products from the same collection
          if (productData.collection) {
            try {
              const relatedResponse = await fetch(
                `http://localhost:3000/products?collection=${encodeURIComponent(productData.collection)}&limit=5`,
              )

              if (relatedResponse.ok) {
                const relatedData = await relatedResponse.json()
                console.log("Related products from database:", relatedData)
                // Filter out the current product from related products
                const filtered = relatedData.products?.filter((p) => p._id !== productData._id) || []
                setRelatedProducts(filtered.slice(0, 4))
              }
            } catch (relatedError) {
              console.warn("Failed to fetch related products:", relatedError)
            }
          }
        } else {
          throw new Error(`Database product not found (${productResponse.status})`)
        }
      } catch (error) {
        console.error("❌ Error fetching from database:", error)
        console.log("🔄 Attempting fallback to static data...")

        // Import static data dynamically to avoid issues
        try {
          const { default: watchesData } = await import("../../data/watches.json")
          const fallbackProduct = watchesData.find((watch) => watch.id === Number.parseInt(id))

          if (fallbackProduct) {
            console.log("✅ Found fallback product in static data:", fallbackProduct)
            setProduct(fallbackProduct)

            // Get related products from static data
            const fallbackRelated = watchesData
              .filter((watch) => watch.collection === fallbackProduct.collection && watch.id !== fallbackProduct.id)
              .slice(0, 4)
            setRelatedProducts(fallbackRelated)
          } else {
            console.log("❌ No fallback product found for ID:", id)
            setError("Product not found in database or static data")
          }
        } catch (staticError) {
          console.error("❌ Error loading static data:", staticError)
          setError("Failed to load product data")
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  if (loading) {
    return (
      <>
        <Header />
        <div className="bg-[#0a0e17] text-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold">Loading Product...</h1>
            <p className="text-gray-400 mt-2">Fetching from database...</p>
          </div>
        </div>
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="bg-[#0a0e17] text-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{error || "Product Not Found"}</h1>
            <p className="text-gray-400 mb-6">
              {error?.includes("database")
                ? "Could not fetch product from database or static data"
                : "This product doesn't exist"}
            </p>
            <Link to="/shop">
              <Button className="bg-[#d4af37] hover:bg-[#b8973a] text-black">Back to Shop</Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  // Determine if this is a database product or static product
  const isDatabaseProduct = product._id !== undefined
  const productId = isDatabaseProduct ? product._id : product.id

  console.log("📊 Product source:", isDatabaseProduct ? "DATABASE" : "STATIC DATA")
  console.log("📊 Product ID:", productId)

  // Handle images based on product source
  const productImages = (() => {
    if (isDatabaseProduct) {
      // Database product - use uploaded images
      if (product.images && product.images.length > 0) {
        return product.images.map((img) => {
          // Check if it's already a full URL
          if (img.startsWith("http")) {
            return img
          }
          return `http://localhost:3000/products/${img}`
        })
      } else if (product.mainImage) {
        const mainImg = product.mainImage.startsWith("http")
          ? product.mainImage
          : `http://localhost:3000/products/${product.mainImage}`
        return [mainImg]
      } else {
        return ["/placeholder.svg?height=600&width=600"]
      }
    } else {
      // Static product - use static image
      return [
        product.image || "/placeholder.svg?height=600&width=600",
        "/placeholder.svg?height=600&width=600&text=Side+View",
        "/placeholder.svg?height=600&width=600&text=Back+View",
        "/placeholder.svg?height=600&width=600&text=Detail+View",
      ]
    }
  })()

  const handleAddToCart = () => {
    if (!isLoggedIn()) {
      toast.error("Please log in to add items to your cart", {
        id: "login-required-cart",
        duration: 4000,
        icon: "🔒",
      })
      return
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }

    
  }

  const handleToggleFavorite = () => {
    if (!isLoggedIn()) {
      toast.error("Please log in to add items to your favorites", {
        id: "login-required-favorites",
        duration: 4000,
        icon: "🔒",
      })
      return
    }

    const isCurrentlyFavorite = isFavorite(productId)
    toggleFavorite(productId, product)

    
  }

  return (
    <>
      <Header />
      <div className="bg-[#162337] text-white min-h-screen">
        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-blue-900/20 text-blue-300 p-2 text-xs text-center">
            📊 Product Source: {isDatabaseProduct ? "DATABASE" : "STATIC DATA"} | ID: {productId}
          </div>
        )}

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-[#d4af37]">
              Home
            </Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-[#d4af37]">
              Shop
            </Link>
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </nav>
        </div>

        {/* Login Notice for Non-Authenticated Users */}
        {!isLoggedIn() && (
          <div className="max-w-7xl mx-auto px-4 mb-6">
            <div className="p-4 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg">
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
                    to add items to your cart and favorites.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-[#0f1420] rounded-lg overflow-hidden">
                <img
                  src={productImages[selectedImage] || "/placeholder.svg?height=600&width=600"}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                  onError={(e) => {
                    console.log("Image failed to load:", e.target.src)
                    e.target.src = "/placeholder.svg?height=600&width=600"
                  }}
                />

                {/* Image Navigation */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                      disabled={selectedImage === 0}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(Math.min(productImages.length - 1, selectedImage + 1))}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                      disabled={selectedImage === productImages.length - 1}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-[#d4af37] text-black text-xs px-3 py-1 rounded-full font-medium">NEW</span>
                  )}
                  {product.isSale && (
                    <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-medium">SALE</span>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative bg-[#0f1420] rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? "border-[#d4af37]" : "border-transparent hover:border-gray-600"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg?height=150&width=150"}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full aspect-square object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=150&width=150"
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating || 4.5) ? "text-[#d4af37] fill-current" : "text-gray-600"
                          }`}
                        />
                      ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    {product.rating || 4.5} ({product.reviews || 20} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold text-[#d4af37]">${product.price?.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      ${product.originalPrice?.toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="text-gray-300 leading-relaxed mb-6">{product.description}</p>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Key Features</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#d4af37] rounded-full"></div>
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Info for Database Products */}
              {isDatabaseProduct && product.stock !== undefined && (
                <div className="p-3 bg-[#0f1420] rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Stock:</span>
                    <span
                      className={`text-sm font-medium ${
                        product.stock > 10 ? "text-green-400" : product.stock > 0 ? "text-yellow-400" : "text-red-400"
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                    </span>
                  </div>
                </div>
              )}

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Quantity:</span>
                    <div className="flex items-center border border-gray-700 rounded">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-[#1a1f2c] transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-[#1a1f2c] transition-colors"
                        disabled={isDatabaseProduct && product.stock && quantity >= product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    className={`flex-1 bg-[#d4af37] hover:bg-[#b8973a] text-black py-6 text-lg font-semibold ${
                      !isLoggedIn() || (isDatabaseProduct && product.stock === 0) ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    disabled={!isLoggedIn() || (isDatabaseProduct && product.stock === 0)}
                    title={
                      !isLoggedIn()
                        ? "Please log in to add to cart"
                        : isDatabaseProduct && product.stock === 0
                          ? "Out of stock"
                          : "Add to cart"
                    }
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    {!isLoggedIn()
                      ? "Login to Add to Cart"
                      : isDatabaseProduct && product.stock === 0
                        ? "Out of Stock"
                        : "Add to Cart"}
                  </Button>
                  <Button
                    onClick={handleToggleFavorite}
                    variant="outline"
                    className={`px-6 py-6 border-gray-600 ${
                      isFavorite(productId) && isLoggedIn()
                        ? "bg-red-600 border-red-600 text-white"
                        : "hover:bg-gray-800"
                    } ${!isLoggedIn() ? "opacity-60 cursor-not-allowed" : ""}`}
                    disabled={!isLoggedIn()}
                    title={!isLoggedIn() ? "Please log in to add to favorites" : "Add to favorites"}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite(productId) && isLoggedIn() ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-800">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-[#d4af37]" />
                  <div>
                    <div className="text-sm font-medium">5-Year Warranty</div>
                    <div className="text-xs text-gray-400">International coverage</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-[#d4af37]" />
                  <div>
                    <div className="text-sm font-medium">Free Shipping</div>
                    <div className="text-xs text-gray-400">On orders over $500</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-[#d4af37]" />
                  <div>
                    <div className="text-sm font-medium">30-Day Returns</div>
                    <div className="text-xs text-gray-400">Hassle-free policy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mb-16">
            <div className="border-b border-gray-800 mb-8">
              <nav className="flex space-x-8">
                {[
                  { id: "description", label: "Description" },
                  { id: "specifications", label: "Specifications" },
                  { id: "reviews", label: `Reviews (${product.reviews || 2})` },
                  { id: "shipping", label: "Shipping & Returns" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-[#d4af37] text-[#d4af37]"
                        : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="bg-[#0f1420] rounded-lg p-8">
              {activeTab === "description" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">About This Timepiece</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      The {product.name} represents the pinnacle of horological excellence, combining traditional Swiss
                      craftsmanship with modern innovation. Each timepiece is meticulously assembled by master
                      watchmakers in our Geneva workshop, ensuring the highest standards of quality and precision.
                    </p>
                    <p className="text-gray-300 leading-relaxed">{product.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Craftsmanship Details</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Hand-assembled by master craftsmen</li>
                      <li>• Over 200 individual quality checks</li>
                      <li>• Premium Swiss movement technology</li>
                      <li>• Ethically sourced materials</li>
                      <li>• Carbon-neutral production process</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
                    <div className="space-y-3">
                      {isDatabaseProduct && product.materials ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Case Material:</span>
                            <span>{product.materials.case || "316L Stainless Steel"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Crystal:</span>
                            <span>{product.materials.crystal || "Sapphire Crystal"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Movement:</span>
                            <span>{product.materials.movement || "Swiss Automatic"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Strap Material:</span>
                            <span>{product.materials.strap || "Genuine Leather"}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Case Material:</span>
                            <span>316L Stainless Steel</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Crystal:</span>
                            <span>Sapphire Crystal</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Movement:</span>
                            <span>Swiss Automatic</span>
                          </div>
                        </>
                      )}

                      {isDatabaseProduct && product.dimensions && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Case Diameter:</span>
                            <span>{product.dimensions.diameter || 42}mm</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Case Thickness:</span>
                            <span>{product.dimensions.thickness || 12}mm</span>
                          </div>
                        </>
                      )}

                      {product.weight && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Weight:</span>
                          <span>{product.weight}g</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Additional Details</h3>
                    <div className="space-y-3">
                      {isDatabaseProduct && product.specifications ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Water Resistance:</span>
                            <span>{product.specifications.waterResistance || "100m / 330ft"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Power Reserve:</span>
                            <span>{product.specifications.powerReserve || "42 Hours"}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Water Resistance:</span>
                            <span>100m / 330ft</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Power Reserve:</span>
                            <span>42 Hours</span>
                          </div>
                        </>
                      )}

                      <div className="flex justify-between">
                        <span className="text-gray-400">Brand:</span>
                        <span>{product.brand || "WHRISTORIUM"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Origin:</span>
                        <span>Switzerland</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Customer Reviews</h3>
                    <Button variant="outline" className="border-gray-600">
                      Write a Review
                    </Button>
                  </div>
                  <div className="text-center text-gray-400 py-8">
                    <p>No reviews yet. Be the first to review this product!</p>
                  </div>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Free Standard Shipping</h4>
                        <p className="text-gray-300 text-sm">
                          Free shipping on all orders over $500. Standard delivery takes 3-5 business days.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Express Shipping</h4>
                        <p className="text-gray-300 text-sm">
                          Express delivery available for $25. Delivery in 1-2 business days.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">International Shipping</h4>
                        <p className="text-gray-300 text-sm">
                          We ship worldwide. International shipping rates calculated at checkout.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Returns & Exchanges</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">30-Day Return Policy</h4>
                        <p className="text-gray-300 text-sm">
                          Return unworn items within 30 days for a full refund. Items must be in original packaging.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Easy Returns Process</h4>
                        <p className="text-gray-300 text-sm">
                          Contact our customer service team to initiate a return. We'll provide a prepaid return label.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => {
                  const relatedId = relatedProduct._id || relatedProduct.id
                  const relatedImage = relatedProduct._id
                    ? relatedProduct.mainImage
                      ? `http://localhost:3000/products/${relatedProduct.mainImage}`
                      : "/placeholder.svg?height=300&width=300"
                    : relatedProduct.image || "/placeholder.svg?height=300&width=300"

                  return (
                    <Link
                      key={relatedId}
                      to={`/product/${relatedId}`}
                      className="group bg-[#0f1420] rounded-lg overflow-hidden hover:bg-[#1a1f2c] transition-colors"
                    >
                      <div className="relative">
                        <img
                          src={relatedImage || "/placeholder.svg"}
                          alt={relatedProduct.name}
                          className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=300&width=300"
                          }}
                        />
                        {relatedProduct.isNew && (
                          <span className="absolute top-3 left-3 bg-[#d4af37] text-black text-xs px-2 py-1 rounded">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-2 group-hover:text-[#d4af37] transition-colors">
                          {relatedProduct.name}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#d4af37]">Rs.{relatedProduct.price?.toLocaleString()}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-[#d4af37] fill-current" />
                            <span className="text-sm">{relatedProduct.rating || 4.5}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductDetail
