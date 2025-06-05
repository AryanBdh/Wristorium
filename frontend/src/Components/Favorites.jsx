"use client";

import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import Button from "../ui/Button";
import { useFavorites } from "../context/FavouritesContext";
import { useCart } from "../context/CartContext";
import watchesData from "../data/watches.json";
import Header from "../Header";

const Favorites = () => {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  // Get favorite watches from the data
  const favoriteWatches = watchesData.filter((watch) =>
    favoriteIds.includes(watch.id)
  );

  const handleAddToCart = (watch) => {
    addToCart(watch);
  };

  if (favoriteWatches.length === 0) {
    return (
      <div className="bg-[#0a0e17] text-white min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <Heart className="h-16 w-16 mx-auto mb-6 text-gray-400" />
            <h1 className="text-3xl font-bold mb-4">No Favorites Yet</h1>
            <p className="text-gray-400 mb-8">
              Start browsing and save your favorite timepieces here.
            </p>
            <Link to="/shop">
              <Button className="bg-[#d4af37] hover:bg-[#b8973a] text-black rounded-none px-8 py-6">
                Browse Watches
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <Header />
      <div className="bg-[#0a0e17] text-white min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
            <p className="text-gray-400">
              {favoriteWatches.length} favorite timepiece
              {favoriteWatches.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteWatches.map((watch) => (
              <div
                key={watch.id}
                className="group bg-[#0f1420] rounded-lg overflow-hidden hover:bg-[#1a1f2c] transition-colors"
              >
                <div className="relative">
                  <img
                    src={watch.image || "/placeholder.svg"}
                    alt={watch.name}
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {watch.isNew && (
                      <span className="bg-[#d4af37] text-black text-xs px-2 py-1 rounded">
                        NEW
                      </span>
                    )}
                    {watch.isSale && (
                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                        SALE
                      </span>
                    )}
                  </div>

                  {/* Remove from favorites button */}
                  <button
                    onClick={() => toggleFavorite(watch.id)}
                    className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-6">
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

                  <p className="text-sm text-gray-400 mb-3 capitalize">
                    {watch.collection} Collection
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {watch.features.slice(0, 2).map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-[#1a1f2c] text-gray-300 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-[#d4af37]">
                        ${watch.price.toLocaleString()}
                      </span>
                      {watch.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ${watch.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={() => handleAddToCart(watch)}
                      size="sm"
                      className="bg-[#d4af37] hover:bg-[#b8973a] text-black rounded-none flex items-center gap-2"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/shop">
              <Button
                variant="outline"
                className="border-gray-600 hover:bg-gray-800"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Favorites;
