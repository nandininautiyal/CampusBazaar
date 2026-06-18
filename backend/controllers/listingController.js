const Listing = require("../models/Listing");

// @route POST /listing
const createListing = async (req, res) => {
  try {
    const { title, description, price, category, images } = req.body;

    if (!title || !description || !price || !category) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const listing = await Listing.create({
      title, description, price, category,
      images: images || [],
      seller: req.user._id,
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /listings
const getListings = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = { status: "active" };

    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: "i" };

    const listings = await Listing.find(query)
      .populate("seller", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /listing/:id
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("seller", "username avatar email");
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PATCH /listing/:id
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this listing" });
    }

    const { title, description, price, category, images } = req.body;

    if (title) listing.title = title;
    if (description) listing.description = description;
    if (price) listing.price = price;
    if (category) listing.category = category;
    if (images) listing.images = images;

    const updated = await listing.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PATCH /listing/:id/status
const updateListingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'active' or 'inactive'" });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this listing" });
    }

    listing.status = status;
    await listing.save();

    res.status(200).json({ message: `Listing marked as ${status}`, listing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /listing/:id
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this listing" });
    }

    await listing.deleteOne();
    res.status(200).json({ message: "Listing deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /me/listings
const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /listing/:id/images
const uploadListingImages = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this listing" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const imageUrls = req.files.map((file) => file.path);
    listing.images.push(...imageUrls);

    await listing.save();

    res.status(200).json({ message: "Images uploaded", listing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createListing, getListings, getListingById,
  updateListing, updateListingStatus, deleteListing, getMyListings,
  uploadListingImages,
};