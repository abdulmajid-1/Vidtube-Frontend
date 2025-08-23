import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // from env
});

//  automatically rewrite if request starts with "/api"
api.interceptors.request.use((config) => {
  if (config.url.startsWith("/api")) {
    config.url = config.url.replace("/api", "");
  }
  return config;
});

export default api;
