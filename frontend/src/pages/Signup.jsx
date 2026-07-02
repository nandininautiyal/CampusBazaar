import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "", email: "", password: "", confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match"); return;
    }
    if (!formData.email.endsWith("@nsut.ac.in")) {
      setError("Only @nsut.ac.in email addresses are allowed"); return;
    }
    setLoading(true);
    try {
      const res = await authAPI.register(formData);
      login(res.user, res.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="card shadow-sm p-4 p-md-5 border" style={{ width: "100%", maxWidth: 460 }}>
        <div className="text-center mb-4">
          <div className="fs-1 mb-2">🛍️</div>
          <h2 className="fw-bold">Join CampusBazaar</h2>
          <p className="text-muted small">Only for NSUT students</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium">Username</label>
            <input name="username" type="text" className="form-control"
              placeholder="Choose a username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-medium">College Email</label>
            <input name="email" type="email" className="form-control"
              placeholder="yourname@nsut.ac.in" value={formData.email} onChange={handleChange} required />
            <div className="form-text">Only @nsut.ac.in emails are allowed</div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-medium">Password</label>
            <input name="password" type="password" className="form-control"
              placeholder="Create a password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="form-label fw-medium">Confirm Password</label>
            <input name="confirmPassword" type="password" className="form-control"
              placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          <button type="submit" disabled={loading} className="btn btn-success w-100 fw-semibold py-2">
            {loading && <span className="spinner-border spinner-border-sm me-2" />}
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-muted small mt-4 mb-0">
          Already have an account?{" "}
          <a href="/login" className="text-success fw-semibold text-decoration-none">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;