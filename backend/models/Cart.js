import mongoose from "mongoose"

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  // Store product snapshot for price consistency
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
    stock: Number,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
})

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One cart per user
      index: true,
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

// Update totals before saving
cartSchema.pre("save", function (next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0)
  this.totalAmount = this.items.reduce((total, item) => {
    const price = item.productSnapshot?.price || 0
    return total + price * item.quantity
  }, 0)
  this.lastUpdated = new Date()
  next()
})

export default mongoose.model("Cart", cartSchema)
