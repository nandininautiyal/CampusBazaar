import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { chatAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Inbox = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchConversations(); }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const data = await chatAPI.getConversations();
      setConversations(data);
    } catch {
      setError("Failed to load conversations.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-success" /></div>;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-1">Inbox</h2>
      <p className="text-muted small mb-4">
        {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      {conversations.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p className="fs-5">💬 No conversations yet.</p>
          <p className="small">Browse listings and message a seller to start chatting.</p>
          <button onClick={() => navigate("/")} className="btn btn-success mt-2">Browse Listings</button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {conversations.map((conv) => {
            const listing = typeof conv.listingId === "object" ? conv.listingId : null;
            const otherUser = user?.id === conv.buyerId?._id ? conv.sellerId : conv.buyerId;

            return (
              <div
                key={conv._id}
                className="card border-0 shadow-sm p-3"
                onClick={() => navigate(`/chat/${conv._id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex gap-3 align-items-center">
                  {listing?.images?.length > 0 && (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
                    />
                  )}
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <h6 className="fw-semibold mb-0 text-truncate">
                        {listing ? listing.title : "Listing"}
                      </h6>
                      <span className="text-muted small ms-2 flex-shrink-0">
                        {new Date(conv.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted small mb-0 text-truncate">
                      {conv.lastMessage || "No messages yet"}
                    </p>
                    {listing && (
                      <span className="text-success small fw-semibold">₹{listing.price}</span>
                    )}
                  </div>
                  <span className="text-muted">→</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Inbox;