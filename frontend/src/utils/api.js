import axios from "axios";

// const BASE =
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE + "/api",
});

export const setAuthHeader = (token) => {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};

export const getImageUrl = (path) => {
  if (!path) return null;

  // Already a valid absolute URL (e.g. Cloudinary, or a link the user pasted)
  try {
    const url = new URL(path);
    if (url.protocol === "http:" || url.protocol === "https:") return path;
  } catch {
    // not a valid absolute URL — fall through
  }

  if (path.startsWith("/") && !/^\/\/|^\/https?\b/i.test(path)) {
    return `${BASE}${path}`;
  }

  return null;
};

export default api;
