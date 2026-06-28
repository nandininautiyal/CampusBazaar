import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-success">404</h1>
        <h2 className="fw-bold mb-3">Page Not Found</h2>
        <p className="text-muted mb-4">The page you're looking for doesn't exist.</p>
        <button onClick={() => navigate("/")} className="btn btn-success px-4">
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;