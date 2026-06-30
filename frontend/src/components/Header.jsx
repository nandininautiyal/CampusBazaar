import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { chatAPI } from "../services/api";

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (!user) return;
    checkUnread();
    const interval = setInterval(checkUnread, 15000); // poll every 15s
    return () => clearInterval(interval);
  }, [user]);

  const checkUnread = async () => {
    try {
      const conversations = await chatAPI.getConversations();
      const results = await Promise.all(
        conversations.map(async (conv) => {
          try {
            const messages = await chatAPI.getMessages(conv._id);
            const lastMsg = messages[messages.length - 1];
            return lastMsg && lastMsg.senderId !== user?.id;
          } catch {
            return false;
          }
        })
      );
      setHasUnread(results.some(Boolean));
    } catch {
      setHasUnread(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-md border-bottom shadow-sm sticky-top py-3">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3 d-flex align-items-center gap-2 text-success" to="/">
          🛍️ CampusBazaar
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-md-0 gap-2">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === "/" ? "active fw-semibold" : ""}`}
                to="/"
              >
                Home
              </Link>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === "/inbox" ? "active fw-semibold" : ""}`}
                    to="/inbox"
                    onClick={() => setHasUnread(false)}
                  >
                    💬 Inbox
                    {hasUnread && <span className="nav-unread-dot" />}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === "/my-listings" ? "active fw-semibold" : ""}`}
                    to="/my-listings"
                  >
                    My Listings
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {user ? (
              <>
                <Link to="/create-listing" className="btn btn-success fw-semibold">
                  + Sell Item
                </Link>
                <span className="text-muted">Hi, <strong>{user.username}</strong></span>
                <button onClick={handleLogout} className="btn btn-outline-danger">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-success">Login</Link>
                <Link to="/signup" className="btn btn-success">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;