const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendOtpEmail = require("../utils/sendOtp");

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// @route POST /register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    let user;
    if (existingUser) {
      existingUser.name = name;
      existingUser.passwordHash = passwordHash;
      existingUser.otpHash = otpHash;
      existingUser.otpExpiresAt = otpExpiresAt;
      user = await existingUser.save();
    } else {
      user = await User.create({ name, email, passwordHash, otpHash, otpExpiresAt, isVerified: false });
    }

    await sendOtpEmail(email, otp);

    res.status(201).json({ message: "OTP sent to email", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /verify-otp
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    if (!user.otpHash || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired, please register again" });
    }

    const isMatch = await bcrypt.compare(otp, user.otpHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    user.isVerified = true;
    user.otpHash = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Email verified successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });
    if (!user.isVerified) return res.status(403).json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /profile
const getProfile = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, verifyOtp, loginUser, getProfile };