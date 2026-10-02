import axios from "axios";

// The API address comes from the Vite env files:
//   .env.development -> local Laravel
//   .env.production  -> live API (used by `npm run build`)
// The fallback only matters if a variable is forgotten during local work.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL,
  // Required so the browser stores and sends the PHP-style session cookie,
  // both on the same site and across different sites.
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

export default api;