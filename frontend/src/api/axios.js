import axios from "axios";

// Base URL of the Laravel API. Override with VITE_API_URL in a .env file.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Laravel origin (without /api) — used for Sanctum's CSRF cookie endpoint.
const backendOrigin = baseURL.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  // Session auth: send/receive the Laravel session cookie on cross-origin requests
  withCredentials: true,
  // Copy the XSRF-TOKEN cookie into the X-XSRF-TOKEN header (needed cross-origin)
  withXSRFToken: true,
});

// Ask Laravel to set the XSRF-TOKEN cookie. Call before login / register.
export const getCsrfCookie = () =>
  axios.get(`${backendOrigin}/sanctum/csrf-cookie`, { withCredentials: true });

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;

    // 419 = CSRF token expired/missing: fetch a fresh cookie and retry once.
    if (response?.status === 419 && config && !config._csrfRetried) {
      config._csrfRetried = true;
      await getCsrfCookie();
      return api(config);
    }

    // 401 = not logged in / session expired. "/me" is the normal guest probe,
    // so don't redirect for that one.
    if (response?.status === 401 && !config?.url?.endsWith("/me")) {
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/register") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
