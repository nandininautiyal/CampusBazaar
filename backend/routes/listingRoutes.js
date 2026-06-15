const express = require("express");
const {
  createListing, getListings, getListingById,
  updateListing, updateListingStatus, deleteListing, getMyListings,
  uploadListingImages,
} = require("../controllers/listingController");
const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/listing", protect, createListing);
router.get("/listings", getListings);
router.get("/me/listings", protect, getMyListings);
router.get("/listing/:id", getListingById);
router.patch("/listing/:id", protect, updateListing);
router.patch("/listing/:id/status", protect, updateListingStatus);
router.post("/listing/:id/images", protect, upload.array("images", 5), uploadListingImages);
router.delete("/listing/:id", protect, deleteListing);

module.exports = router;