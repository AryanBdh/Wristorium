import mongoose from "mongoose"

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phone: {
      type: String,
      required: true,
    }, 
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      name: String,
      street: String,
      city: String,
      district: String,
      zipCode: String,
      country: String,
    },
    paymentMethod: {
      type: String,
      enum: ["esewa", "cash_on_delivery"],
      default: "cash_on_delivery",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    transactionId: {
      type: String,
      default: null,
    },
    paymentGatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    notes: String,
    trackingNumber: String,
    deliveryDate: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

// Generate a unique order number before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const date = new Date()
    const year = date.getFullYear().toString().substr(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")

    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      },
    })

    this.orderNumber = `WH-${year}${month}${day}-${(count + 1).toString().padStart(4, "0")}`
  }
  next()
})


export default mongoose.model("Order", orderSchema)
