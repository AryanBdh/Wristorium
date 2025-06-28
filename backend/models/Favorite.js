import mongoose from "mongoose"

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // Store product snapshot in case product gets deleted
    productSnapshot: {
      name: String,
      price: Number,
      originalPrice: Number,
      image: String,
      mainImage: String,
      category: String,
      brand: String,
      description: String,
      features: [String],
      rating: Number,
      reviews: Number,
      isNewProduct: Boolean,
      isSale: Boolean,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

// Compound index to prevent duplicate favorites
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true })

// Method to get product details (from DB or snapshot)
favoriteSchema.methods.getProductDetails = async function () {
  await this.populate("productId")
  return this.productId || this.productSnapshot
}

export default mongoose.model("Favorite", favoriteSchema)
