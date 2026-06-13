const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lastMessage: { type: String, default: "" },
  },
  { timestamps: true }
);

// Prevents duplicate conversations for the same listing + buyer pair
conversationSchema.index({ listingId: 1, buyerId: 1 }, { unique: true });

module.exports = mongoose.model("Conversation", conversationSchema);
