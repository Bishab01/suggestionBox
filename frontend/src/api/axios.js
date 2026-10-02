import axios from "axios";

// VITE_API_URL points at the folder that holds the PHP files, e.g.
//   .env.development -> http://localhost/sujhav_peti/backend/src/api/
//   .env.production  -> https://your-host/backend/src/api/
// Calls then look like: api.post("login.php", {...})
const baseURL = import.meta.env.VITE_API_URL || "http://localhost/sujhav_peti/backend/src/api/";

const api = axios.create({
  baseURL,
  // Needed so the browser stores/sends the PHP session cookie (PHPSESSID)
  withCredentials: true,
  // Don't add custom headers like X-Requested-With here: cors.php only allows
  // "Content-Type", so any extra header makes the preflight request fail.
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
