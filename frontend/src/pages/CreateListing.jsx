import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { listingAPI } from "../services/api";

const CATEGORIES = ["books", "electronics", "hostel-essentials", "furniture", "cycles", "clothing", "other"];

const CreateListing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "", price: "", category: "" });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (imageFiles.length + files.length > 5) { setError("Maximum 5 images allowed"); return; }
    setImageFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.category) { setError("Please select a category"); return; }
    if (imageFiles.length === 0) { setError("Please upload at least one image"); return; }
    setLoading(true);
    try {
      const listing = await listingAPI.createListing({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
      });
      await listingAPI.uploadImages(listing._id, imageFiles);
      navigate("/my-listings");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border shadow-sm p-4 p-md-5">
            <h2 className="fw-bold mb-1">Post a New Listing</h2>
            <p className="text-muted small mb-4">Fill in the details to sell your item</p>

            {error && <div className="alert alert-danger small py-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-medium">Title</label>
                <input name="title" className="form-control" placeholder="What are you selling?"
                  value={formData.title} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Description</label>
                <textarea name="description" className="form-control" rows={4}
                  placeholder="Describe your item..." value={formData.description} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Price (₹)</label>
                <input name="price" type="number" className="form-control" placeholder="0"
                  value={formData.price} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Category</label>
                <select name="category" className="form-select" value={formData.category} onChange={handleChange} required>
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace("-", " ")}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="form-label fw-medium">Images (up to 5)</label>
                <input type="file" className="form-control" multiple accept="image/*"
                  onChange={handleImages} disabled={imageFiles.length >= 5} />
                {previews.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {previews.map((p, i) => (
                      <div key={i} className="position-relative">
                        <img src={p} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }} />
                        <button type="button" onClick={() => removeImage(i)}
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 px-1"
                          style={{ fontSize: 10, lineHeight: 1.5 }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" disabled={loading} className="btn btn-success w-100 fw-semibold py-2">
                {loading && <span className="spinner-border spinner-border-sm me-2" />}
                {loading ? "Creating..." : "Post Listing"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;