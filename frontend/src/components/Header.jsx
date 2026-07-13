import React, { useState, useEffect, useRef } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, []);

  // Check for unread messages every 15s
  useEffect(() => {
    if (!user) return;
    checkUnread();
    const interval = setInterval(checkUnread, 15000);
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
    setMenuOpen(false);
    navigate("/login");
  };

  const navLink = (path, label, dot = false) => (
    <Link
      to={path}
      onClick={() => setMenuOpen(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "10px 16px",
        borderRadius: 8,
        textDecoration: "none",
        fontWeight: 500,
        fontSize: "1rem",
        color: location.pathname === path
          ? "var(--color-primary)"
          : "var(--color-text-secondary)",
        backgroundColor: location.pathname === path
          ? "rgba(37,110,255,0.08)"
          : "transparent",
        position: "relative",
      }}
    >
      {label}
      {dot && hasUnread && (
        <span style={{
          width: 8, height: 8,
          borderRadius: "50%",
          backgroundColor: "var(--color-accent)",
          display: "inline-block",
          marginLeft: 2,
        }} />
      )}
    </Link>
  );

  return (
    <nav
      ref={navRef}
      style={{
        backgroundColor: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 16px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}>

        {/* Brand */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          style={{
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "var(--color-primary)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          🛍️ CampusBazaar
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}
          className="d-none d-md-flex">
          {navLink("/", "Home")}
          {user && navLink("/inbox", "💬 Inbox", true)}
          {user && navLink("/my-listings", "My Listings")}
        </div>

        {/* Desktop Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}
          className="d-none d-md-flex">
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          {user ? (
            <>
              <Link to="/create-listing" className="btn btn-success btn-sm fw-semibold">
                + Sell Item
              </Link>
              <span style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>
                Hi, <strong style={{ color: "var(--color-text)" }}>{user.username}</strong>
              </span>
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

        {/* Mobile Right — theme toggle + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}
          className="d-flex d-md-none">
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            style={{
              background: "none",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              padding: "6px 10px",
              cursor: "pointer",
              fontSize: 20,
              color: "var(--color-text)",
              lineHeight: 1,
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          className="d-md-none"
          style={{
            backgroundColor: "var(--color-surface)",
            borderTop: "1px solid var(--color-border)",
            padding: "12px 16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {navLink("/", "🏠 Home")}
          {user && navLink("/inbox", "💬 Inbox", true)}
          {user && navLink("/my-listings", "📋 My Listings")}

          <div style={{ borderTop: "1px solid var(--color-border)", marginTop: 8, paddingTop: 12 }}>
            {user ? (
              <>
                <Link
                  to="/create-listing"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 16px",
                    backgroundColor: "var(--color-primary)",
                    color: "#fff",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: 600,
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  + Sell Item
                </Link>
                <p style={{
                  color: "var(--color-text-secondary)",
                  fontSize: 13,
                  textAlign: "center",
                  margin: "0 0 8px",
                }}>
                  Signed in as <strong style={{ color: "var(--color-text)" }}>{user.username}</strong>
                </p>
                <button
                  onClick={handleLogout}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 16px",
                    backgroundColor: "transparent",
                    color: "#ef4444",
                    border: "1px solid #ef4444",
                    borderRadius: 8,
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    padding: "10px 16px",
                    border: "1px solid var(--color-primary)",
                    color: "var(--color-primary)",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    padding: "10px 16px",
                    backgroundColor: "var(--color-primary)",
                    color: "#fff",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;