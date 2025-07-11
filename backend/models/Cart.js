import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
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
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User",
  },
  items: [itemSchema],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Virtual fields
cartSchema.virtual("totalItems").get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

cartSchema.virtual("totalAmount").get(function () {
  return this.items.reduce((sum, item) => {
    return sum + ((item.productSnapshot?.price || 0) * item.quantity);
  }, 0);
});

cartSchema.set("toJSON", { virtuals: true });
cartSchema.set("toObject", { virtuals: true });

export default mongoose.model("Cart", cartSchema);
