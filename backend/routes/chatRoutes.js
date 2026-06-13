const express = require("express");
const { createConversation, getConversations, getMessages, sendMessage } = require("../controllers/chatController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/conversations", protect, createConversation);
router.get("/conversations", protect, getConversations);
router.get("/messages/:conversationId", protect, getMessages);
router.post("/messages/:conversationId", protect, sendMessage);

module.exports = router;