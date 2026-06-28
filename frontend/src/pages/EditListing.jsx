import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { listingAPI } from "../services/api";

const CATEGORIES = ["books", "electronics", "hostel-essentials", "furniture", "cycles", "clothing", "other"];

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "", price: "", category: "" });

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await listingAPI.getListingById(id);
        setFormData({ title: data.title, description: data.description, price: data.price.toString(), category: data.category });
        setExistingImages(data.images);
      } catch {
        setError("Failed to load listing.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files || []);
    const total = existingImages.length + newFiles.length + files.length;
    if (total > 5) { setError("Maximum 5 images allowed"); return; }
    setNewFiles((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onloadend = () => setNewPreviews((prev) => [...prev, reader.result]);
      reader.readAsDataURL(f);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await listingAPI.updateListing(id, {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        images: existingImages,
      });
      if (newFiles.length > 0) await listingAPI.uploadImages(id, newFiles);
      navigate("/my-listings");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update listing");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-success" /></div>;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <button onClick={() => navigate("/my-listings")} className="btn btn-link text-success p-0 mb-3">← Back</button>
          <div className="card border-0 shadow-sm p-4">
            <h2 className="fw-bold mb-1">Edit Listing</h2>
            <p className="text-muted small mb-4">Update your listing details</p>

            {error && <div className="alert alert-danger small py-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-medium">Title</label>
                <input name="title" className="form-control" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Description</label>
                <textarea name="description" className="form-control" rows={4} value={formData.description} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Price (₹)</label>
                <input name="price" type="number" className="form-control" value={formData.price} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Category</label>
                <select name="category" className="form-select" value={formData.category} onChange={handleChange} required>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {existingImages.length > 0 && (
                <div className="mb-3">
                  <label className="form-label fw-medium">Current Images</label>
                  <div className="d-flex flex-wrap gap-2">
                    {existingImages.map((img, i) => (
                      <div key={i} className="position-relative">
                        <img src={img} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }} />
                        <button type="button" onClick={() => setExistingImages((prev) => prev.filter((_, idx) => idx !== i))} className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 px-1" style={{ fontSize: 10 }}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="form-label fw-medium">Add More Images</label>
                <input type="file" className="form-control" multiple accept="image/*" onChange={handleNewImages} disabled={existingImages.length + newFiles.length >= 5} />
                {newPreviews.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {newPreviews.map((p, i) => (
                      <img key={i} src={p} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }} />
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" disabled={saving} className="btn btn-success w-100 fw-semibold">
                {saving && <span className="spinner-border spinner-border-sm me-2" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditListing;