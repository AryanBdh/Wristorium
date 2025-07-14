import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
    },
    category: {
      type: String,
      enum: ["men", "women", "smart"],
      required: true,
    },
    brand: {
      type: String,
      default: "WHRISTORIUM",
    },
    features: {
      type: [String],
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    mainImage: {
      type: String,
    },
    isNewProduct: {
      type: Boolean,
      default: false,
    },
    isSale: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    weight: {
      type: Number,
    },
    dimensions: {
      diameter: Number,
      thickness: Number,
      lugWidth: Number,
    },
    materials: {
      case: String,
      crystal: String,
      strap: String,
      movement: String,
    },
    specifications: {
      waterResistance: String,
      powerReserve: String,
      functions: [String],
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    sku: {
      type: Number,
      unique: true,
      sparse: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

productSchema.methods.toJSON = function () {
  const obj = this.toObject()

  // Process images to add full URLs
  if (obj.images && obj.images.length > 0) {
    obj.images = obj.images.map((image) => {
      if (image.startsWith("http")) {
        return image
      } else {
        return `http://localhost:5000/products/${image}`
      }
    })
  }

  if (obj.mainImage) {
    if (obj.mainImage.startsWith("http")) {
      obj.mainImage = obj.mainImage
    } else {
      obj.mainImage = `http://localhost:5000/products/${obj.mainImage}`
    }
  } else if (obj.images && obj.images.length > 0) {
    obj.mainImage = obj.images[0]
  }

  return obj
}

export default mongoose.model("Product", productSchema)
