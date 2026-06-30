import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white border-bottom shadow-sm sticky-top py-3">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3 d-flex align-items-center gap-2" to="/" style={{ color: "var(--color-primary)" }}>
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
                  >
                    💬 Inbox
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