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
      <div className="hero-section text-white py-5">
        <div className="container">
          <h1 className="fw-bold mb-1" style={{ color: "#fff" }}>Buy & Sell on Campus</h1>
          <p className="mb-4" style={{ color: "rgba(255,255,255,0.85)" }}>
            The trusted marketplace for NSUT students
          </p>
          <div className="row g-2">
            <div className="col-12 col-md-7">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="🔍 Search listings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-3">
              <select
                className="form-select form-select-lg"
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
          <div className="text-center py-5">
            <p className="fs-5 text-muted">No listings found.</p>
            <p className="text-muted small">Try adjusting your search or category.</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {listings.map((listing) => (
              <div key={listing._id} className="col">
                <div
                  className="card h-100 shadow-sm border"
                  onClick={() => navigate(`/listing/${listing._id}`)}
                  style={{ cursor: "pointer", transition: "box-shadow 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,110,255,0.15)"}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = ""}
                >
                  <div
                    className="card-img-placeholder d-flex align-items-center justify-content-center"
                    style={{ height: 200, overflow: "hidden", borderRadius: "8px 8px 0 0" }}
                  >
                    {listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span className="text-muted small">No image</span>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title fw-semibold text-truncate">{listing.title}</h6>
                    <p
                      className="card-text text-muted small"
                      style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
                    >
                      {listing.description}
                    </p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <span className="fw-bold fs-5 text-success">₹{listing.price}</span>
                      <span className="badge bg-secondary border">{listing.category}</span>
                    </div>
                    <div className="text-muted small mt-2">
                      by <strong>{listing.seller?.username || "unknown"}</strong>
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