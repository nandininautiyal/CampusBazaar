const express = require("express");
const { registerUser, verifyOtp, loginUser, getProfile } = require("../controllers/authController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

module.exports = router;