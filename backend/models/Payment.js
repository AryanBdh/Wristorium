import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["esewa", "cash_on_delivery"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      default: null,
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    notes: String,
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

export default mongoose.model("Payment", paymentSchema)
