import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listingAPI } from "../services/api";

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "books", label: "Books" },
  { value: "electronics", label: "Electronics" },
  { value: "hostel-essentials", label: "Hostel Essentials" },
  { value: "furniture", label: "Furniture" },
  { value: "cycles", label: "Cycles" },
  { value: "clothing", label: "Clothing" },
  { value: "other", label: "Other" },
];

const Home = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => fetchListings(), 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  const fetchListings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listingAPI.getListings({
        search: search || undefined,
        category: category || undefined,
      });
      setListings(data);
    } catch {
      setError("Failed to load listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <div className="bg-success text-white py-5">
        <div className="container">
          <h1 className="fw-bold mb-1">Buy & Sell on Campus</h1>
          <p className="mb-4 opacity-75">The trusted marketplace for NSUT students</p>
          <div className="row g-2">
            <div className="col-12 col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search listings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-3">
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="container py-5">
        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-success" role="status" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p className="fs-5">No listings found.</p>
            <p className="small">Try adjusting your search or category.</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {listings.map((listing) => (
              <div key={listing._id} className="col">
                <div
                  className="card h-100 shadow-sm border-0 cursor-pointer"
                  onClick={() => navigate(`/listing/${listing._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div style={{ height: 180, overflow: "hidden", background: "#f0f0f0" }}>
                    {listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="card-img-top w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted small">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title fw-semibold text-truncate">{listing.title}</h6>
                    <p className="card-text text-muted small" style={{ fontSize: "0.8rem", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {listing.description}
                    </p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-success fs-5">₹{listing.price}</span>
                      <span className="badge bg-light text-dark border">{listing.category}</span>
                    </div>
                    <div className="text-muted small mt-2">
                      by {listing.seller?.username}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;