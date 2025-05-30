"use client";

import { useState } from "react";
import { Link, useParams } from "react-router-dom";
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
} from "lucide-react";
import Button from "../../ui/Button";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavouritesContext";
import watchesData from "../../data/watches.json";
import Header from "../../Header";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  // Find the product by ID
  const product = watchesData.find((watch) => watch.id === Number.parseInt(id));

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  if (!product) {
    return (
      <div className="bg-[#0a0e17] text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/shop">
            <Button className="bg-[#d4af37] hover:bg-[#b8973a] text-black">
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock additional images for the gallery
  const productImages = [
    product.image,
    "https://via.placeholder.com/600x600?text=Side+View",
    "https://via.placeholder.com/600x600?text=Back+View",
    "https://via.placeholder.com/600x600?text=Detail+View",
  ];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id, product.name);
  };

  const relatedProducts = watchesData
    .filter(
      (watch) =>
        watch.collection === product.collection && watch.id !== product.id
    )
    .slice(0, 4);

  const reviews = [
    {
      id: 1,
      name: "John Smith",
      rating: 5,
      date: "2024-01-10",
      comment:
        "Absolutely stunning timepiece. The craftsmanship is exceptional and it feels premium on the wrist.",
      verified: true,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      rating: 5,
      date: "2024-01-05",
      comment:
        "Perfect gift for my husband. He loves the design and the quality is outstanding.",
      verified: true,
    },
    {
      id: 3,
      name: "Michael Chen",
      rating: 4,
      date: "2023-12-28",
      comment:
        "Great watch, exactly as described. Fast shipping and excellent packaging.",
      verified: true,
    },
  ];

  return (
    <>
    <Header />
      <div className="bg-[#0a0e17] text-white min-h-screen">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-6">
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

        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-[#0f1420] rounded-lg overflow-hidden">
                <img
                  src={productImages[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />

                {/* Image Navigation */}
                <button
                  onClick={() =>
                    setSelectedImage(Math.max(0, selectedImage - 1))
                  }
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  disabled={selectedImage === 0}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() =>
                    setSelectedImage(
                      Math.min(productImages.length - 1, selectedImage + 1)
                    )
                  }
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  disabled={selectedImage === productImages.length - 1}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-[#d4af37] text-black text-xs px-3 py-1 rounded-full font-medium">
                      NEW
                    </span>
                  )}
                  {product.isSale && (
                    <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      SALE
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative bg-[#0f1420] rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? "border-[#d4af37]"
                        : "border-transparent hover:border-gray-600"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#d4af37] text-sm uppercase tracking-wider">
                    {product.collection} Collection
                  </span>
                  {product.features.includes("Limited Edition") && (
                    <span className="bg-purple-900/20 text-purple-400 text-xs px-2 py-1 rounded">
                      Limited Edition
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating)
                              ? "text-[#d4af37] fill-current"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold text-[#d4af37]">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="text-gray-300 leading-relaxed mb-6">
                  {product.description}
                </p>
              </div>

              {/* Features */}
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
                      <span className="px-4 py-2 min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-[#1a1f2c] transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#d4af37] hover:bg-[#b8973a] text-black py-6 text-lg font-semibold"
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleToggleFavorite}
                    variant="outline"
                    className={`px-6 py-6 border-gray-600 ${
                      isFavorite(product.id)
                        ? "bg-red-600 border-red-600 text-white"
                        : "hover:bg-gray-800"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isFavorite(product.id) ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    className="px-6 py-6 border-gray-600 hover:bg-gray-800"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-800">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-[#d4af37]" />
                  <div>
                    <div className="text-sm font-medium">5-Year Warranty</div>
                    <div className="text-xs text-gray-400">
                      International coverage
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-[#d4af37]" />
                  <div>
                    <div className="text-sm font-medium">Free Shipping</div>
                    <div className="text-xs text-gray-400">
                      On orders over $500
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-[#d4af37]" />
                  <div>
                    <div className="text-sm font-medium">30-Day Returns</div>
                    <div className="text-xs text-gray-400">
                      Hassle-free policy
                    </div>
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
                  { id: "reviews", label: `Reviews (${reviews.length})` },
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
                    <h3 className="text-xl font-semibold mb-4">
                      About This Timepiece
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      The {product.name} represents the pinnacle of horological
                      excellence, combining traditional Swiss craftsmanship with
                      modern innovation. Each timepiece is meticulously
                      assembled by master watchmakers in our Geneva workshop,
                      ensuring the highest standards of quality and precision.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      This exceptional watch features premium materials
                      including 316L stainless steel case, sapphire crystal
                      glass, and genuine leather strap. The movement is
                      precision-engineered to provide accurate timekeeping for
                      years to come.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">
                      Craftsmanship Details
                    </h4>
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
                    <h3 className="text-xl font-semibold mb-4">
                      Technical Specifications
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Case Material:</span>
                        <span>316L Stainless Steel</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Case Diameter:</span>
                        <span>42mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Case Thickness:</span>
                        <span>12mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Crystal:</span>
                        <span>Sapphire Crystal</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Water Resistance:</span>
                        <span>100m / 330ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Movement:</span>
                        <span>Swiss Automatic</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Additional Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Strap Material:</span>
                        <span>Genuine Leather</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Strap Width:</span>
                        <span>22mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Clasp Type:</span>
                        <span>Deployment Buckle</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Power Reserve:</span>
                        <span>42 Hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Weight:</span>
                        <span>165g</span>
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

                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-800 pb-6 last:border-b-0"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-medium">{review.name}</span>
                              {review.verified && (
                                <span className="bg-green-900/20 text-green-400 text-xs px-2 py-1 rounded">
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {Array(5)
                                  .fill(0)
                                  .map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "text-[#d4af37] fill-current"
                                          : "text-gray-600"
                                      }`}
                                    />
                                  ))}
                              </div>
                              <span className="text-sm text-gray-400">
                                {review.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Shipping Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">
                          Free Standard Shipping
                        </h4>
                        <p className="text-gray-300 text-sm">
                          Free shipping on all orders over $500. Standard
                          delivery takes 3-5 business days.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Express Shipping</h4>
                        <p className="text-gray-300 text-sm">
                          Express delivery available for $25. Delivery in 1-2
                          business days.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">
                          International Shipping
                        </h4>
                        <p className="text-gray-300 text-sm">
                          We ship worldwide. International shipping rates
                          calculated at checkout.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Returns & Exchanges
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">
                          30-Day Return Policy
                        </h4>
                        <p className="text-gray-300 text-sm">
                          Return unworn items within 30 days for a full refund.
                          Items must be in original packaging.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">
                          Easy Returns Process
                        </h4>
                        <p className="text-gray-300 text-sm">
                          Contact our customer service team to initiate a
                          return. We'll provide a prepaid return label.
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
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    to={`/product/${relatedProduct.id}`}
                    className="group bg-[#0f1420] rounded-lg overflow-hidden hover:bg-[#1a1f2c] transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={relatedProduct.image || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
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
                      <p className="text-sm text-gray-400 mb-2 capitalize">
                        {relatedProduct.collection} Collection
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#d4af37]">
                          ${relatedProduct.price.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-[#d4af37] fill-current" />
                          <span className="text-sm">
                            {relatedProduct.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
