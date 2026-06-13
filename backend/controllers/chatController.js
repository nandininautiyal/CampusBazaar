const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Listing = require("../models/Listing");

// @route POST /conversations
const createConversation = async (req, res) => {
  try {
    const { listingId } = req.body;

    if (!listingId) return res.status(400).json({ message: "listingId is required" });

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot message yourself about your own listing" });
    }

    // upsert avoids creating duplicate conversations for the same listing + buyer
    const conversation = await Conversation.findOneAndUpdate(
      { listingId, buyerId: req.user._id },
      { $setOnInsert: { listingId, buyerId: req.user._id, sellerId: listing.seller } },
      { new: true, upsert: true }
    );

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /conversations
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      $or: [{ buyerId: req.user._id }, { sellerId: req.user._id }],
    })
      .populate("listingId", "title images price status")
      .populate("buyerId", "name avatar")
      .populate("sellerId", "name avatar")
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /messages/:conversationId
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    const isParticipant =
      conversation.buyerId.toString() === req.user._id.toString() ||
      conversation.sellerId.toString() === req.user._id.toString();

    if (!isParticipant) return res.status(403).json({ message: "Not authorized to view this conversation" });

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /messages/:conversationId
// HTTP fallback for sending a message; Socket.io will handle real-time later
const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) return res.status(400).json({ message: "Message text is required" });

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    const isParticipant =
      conversation.buyerId.toString() === req.user._id.toString() ||
      conversation.sellerId.toString() === req.user._id.toString();

    if (!isParticipant) return res.status(403).json({ message: "Not authorized to message in this conversation" });

    const message = await Message.create({ conversationId, senderId: req.user._id, text: text.trim() });

    conversation.lastMessage = text.trim();
    await conversation.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createConversation, getConversations, getMessages, sendMessage };