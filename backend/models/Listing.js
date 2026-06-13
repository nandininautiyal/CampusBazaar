const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["books", "electronics", "hostel-essentials", "furniture", "cycles", "clothing", "other"],
    },
    images: { type: [String], default: [] },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

listingSchema.index({ status: 1, category: 1 });

module.exports = mongoose.model("Listing", listingSchema);