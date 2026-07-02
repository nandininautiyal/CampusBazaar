import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listingAPI } from "../services/api";

const MyListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchListings(); }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const data = await listingAPI.getMyListings();
      setListings(data);
    } catch {
      setError("Failed to load your listings.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await listingAPI.updateListingStatus(id, newStatus);
      setListings((prev) => prev.map((l) => l._id === id ? { ...l, status: newStatus } : l));
    } catch {
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await listingAPI.deleteListing(id);
      setListings((prev) => prev.filter((l) => l._id !== id));
      setDeleteId(null);
    } catch {
      alert("Failed to delete listing.");
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center py-5">
      <div className="spinner-border text-success" />
    </div>
  );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-0">My Listings</h2>
          <p className="text-muted small mb-0">Manage your items for sale</p>
        </div>
        <button onClick={() => navigate("/create-listing")} className="btn btn-success fw-semibold">
          + New Listing
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {listings.length === 0 ? (
        <div className="text-center py-5">
          <p className="fs-5 text-muted">No listings yet.</p>
          <button onClick={() => navigate("/create-listing")} className="btn btn-success mt-2">
            Post Your First Listing
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {listings.map((listing) => (
            <div key={listing._id} className="card border shadow-sm p-3">
              <div className="d-flex gap-3 align-items-center flex-wrap">
                <div
                  className="card-img-placeholder rounded d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 80, height: 80, overflow: "hidden" }}
                >
                  {listing.images.length > 0 ? (
                    <img src={listing.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span className="text-muted" style={{ fontSize: 10 }}>No img</span>
                  )}
                </div>
                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <h6 className="fw-semibold mb-0">{listing.title}</h6>
                  <p className="text-muted small mb-1">
                    {listing.description.length > 60 ? listing.description.slice(0, 60) + "..." : listing.description}
                  </p>
                  <div className="d-flex gap-2 align-items-center flex-wrap">
                    <span className="text-success fw-bold">₹{listing.price}</span>
                    <span className="badge bg-secondary">{listing.category}</span>
                    <span className={`badge ${listing.status === "active" ? "bg-success" : "bg-secondary"}`}>
                      {listing.status}
                    </span>
                  </div>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleToggleStatus(listing._id, listing.status)}
                    className={`btn btn-sm ${listing.status === "active" ? "btn-outline-warning" : "btn-outline-success"}`}
                  >
                    {listing.status === "active" ? "Mark Sold" : "Reactivate"}
                  </button>
                  <button onClick={() => navigate(`/edit-listing/${listing._id}`)} className="btn btn-sm btn-outline-primary">
                    Edit
                  </button>
                  <button onClick={() => setDeleteId(listing._id)} className="btn btn-sm btn-outline-danger">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom">
                <h5 className="modal-title">Confirm Delete</h5>
                <button onClick={() => setDeleteId(null)} className="btn-close" />
              </div>
              <div className="modal-body">
                <p className="mb-0">Are you sure you want to delete this listing? This cannot be undone.</p>
              </div>
              <div className="modal-footer border-top">
                <button onClick={() => setDeleteId(null)} className="btn btn-outline-secondary">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;