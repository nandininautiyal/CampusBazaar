import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: API_BASE });

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// ─── Auth ──────────────────────────────────────────────────

export const authAPI = {
  register: async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },
  login: async (data) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get("/auth/profile");
    return res.data.user;
  },
};

// ─── Listings ──────────────────────────────────────────────

export const listingAPI = {
  getListings: async (params) => {
    const res = await api.get("/listings", { params });
    return res.data;
  },
  getListingById: async (id) => {
    const res = await api.get(`/listing/${id}`);
    return res.data;
  },
  createListing: async (data) => {
    const res = await api.post("/listing", data);
    return res.data;
  },
  updateListing: async (id, data) => {
    const res = await api.patch(`/listing/${id}`, data);
    return res.data;
  },
  updateListingStatus: async (id, status) => {
    const res = await api.patch(`/listing/${id}/status`, { status });
    return res.data;
  },
  deleteListing: async (id) => {
    const res = await api.delete(`/listing/${id}`);
    return res.data;
  },
  getMyListings: async () => {
    const res = await api.get("/me/listings");
    return res.data;
  },
  uploadImages: async (id, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    const res = await api.post(`/listing/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};

// ─── Chat ──────────────────────────────────────────────────

export const chatAPI = {
  createConversation: async (listingId) => {
    const res = await api.post("/conversations", { listingId });
    return res.data;
  },
  getConversations: async () => {
    const res = await api.get("/conversations");
    return res.data;
  },
  getMessages: async (conversationId) => {
    const res = await api.get(`/messages/${conversationId}`);
    return res.data;
  },
  sendMessage: async (conversationId, text) => {
    const res = await api.post(`/messages/${conversationId}`, { text });
    return res.data;
  },
};

export default api;