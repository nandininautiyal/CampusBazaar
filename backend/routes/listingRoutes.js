const express = require("express");
const {
  createListing, getListings, getListingById,
  updateListing, updateListingStatus, deleteListing, getMyListings,
} = require("../controllers/listingController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/listing", protect, createListing);
router.get("/listings", getListings);
router.get("/me/listings", protect, getMyListings);
router.get("/listing/:id", getListingById);
router.patch("/listing/:id", protect, updateListing);
router.patch("/listing/:id/status", protect, updateListingStatus);
router.delete("/listing/:id", protect, deleteListing);

module.exports = router;