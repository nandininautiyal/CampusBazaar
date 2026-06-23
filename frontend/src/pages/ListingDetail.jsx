import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { listingAPI, chatAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [contacting, setContacting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await listingAPI.getListingById(id);
        setListing(data);
      } catch {
        setError("Listing not found.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleMessageSeller = async () => {
    if (!user) { navigate("/login"); return; }
    setContacting(true);
    try {
      const conv = await chatAPI.createConversation(listing._id);
      navigate(`/chat/${conv._id}`);
    } catch {
      alert("Failed to start conversation. Please try again.");
    } finally {
      setContacting(false);
    }
  };

  if (loading) return <div className="d-flex justify-content-center align-items-center min-vh-100"><div className="spinner-border text-success" /></div>;
  if (error || !listing) return <div className="container py-5 text-center text-muted">{error || "Listing not found."}</div>;

  const isSeller = user && user.id === listing.seller._id;

  return (
    <div className="container py-5">
      <button className="btn btn-link text-success p-0 mb-4" onClick={() => navigate("/")}>
        ← Back to listings
      </button>

      <div className="row g-4">
        {/* Images */}
        <div className="col-12 col-lg-7">
          <div className="bg-light rounded overflow-hidden" style={{ height: 380 }}>
            {listing.images.length > 0 ? (
              <img
                src={listing.images[currentImage]}
                alt={listing.title}
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">No image</div>
            )}
          </div>
          {listing.images.length > 1 && (
            <div className="d-flex gap-2 mt-2">
              {listing.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  onClick={() => setCurrentImage(i)}
                  className={`rounded border ${i === currentImage ? "border-success border-2" : ""}`}
                  style={{ width: 60, height: 60, objectFit: "cover", cursor: "pointer" }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h2 className="fw-bold mb-1">{listing.title}</h2>
            <h3 className="text-success fw-bold mb-3">₹{listing.price}</h3>

            <div className="mb-3 d-flex gap-2">
              <span className="badge bg-secondary">{listing.category}</span>
              <span className={`badge ${listing.status === "active" ? "bg-success" : "bg-secondary"}`}>
                {listing.status === "active" ? "Available" : "Sold"}
              </span>
            </div>

            <h6 className="fw-semibold">Description</h6>
            <p className="text-muted mb-4">{listing.description}</p>

            <div className="border-top pt-3 mb-4">
              <h6 className="fw-semibold mb-1">Seller</h6>
              <p className="mb-0 text-muted">{listing.seller.username}</p>
            </div>

            {isSeller ? (
              <div className="alert alert-light text-center small">This is your listing</div>
            ) : user ? (
              <button
                onClick={handleMessageSeller}
                disabled={contacting || listing.status === "inactive"}
                className="btn btn-success w-100 fw-semibold"
              >
                {contacting ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                {contacting ? "Starting chat..." : "💬 Message Seller"}
              </button>
            ) : (
              <button onClick={() => navigate("/login")} className="btn btn-outline-success w-100">
                Login to Message Seller
              </button>
            )}

            <p className="text-muted small mt-3">
              Posted on {new Date(listing.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;