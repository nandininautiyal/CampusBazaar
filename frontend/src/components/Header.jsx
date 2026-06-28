import React, { useState } from "react";
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
    <nav className="navbar navbar-expand-md navbar-light bg-white border-bottom shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-success fs-4" to="/">
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
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === "/" ? "active fw-semibold text-success" : ""}`}
                to="/"
              >
                Home
              </Link>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === "/inbox" ? "active fw-semibold text-success" : ""}`}
                    to="/inbox"
                  >
                    💬 Inbox
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === "/my-listings" ? "active fw-semibold text-success" : ""}`}
                    to="/my-listings"
                  >
                    My Listings
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <Link to="/create-listing" className="btn btn-success btn-sm">
                  + Sell Item
                </Link>
                <span className="text-muted small">Hi, <strong>{user.username}</strong></span>
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-success btn-sm">Login</Link>
                <Link to="/signup" className="btn btn-success btn-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;