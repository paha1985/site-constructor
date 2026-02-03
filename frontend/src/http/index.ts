import axios from "axios";
import { REACT_APP_API_URL } from "../constants";

const $host = axios.create({
  baseURL: REACT_APP_API_URL,
});

const $authHost = axios.create({
  baseURL: REACT_APP_API_URL,
});

const authInterceptor = (config: any) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.authorization = `Bearer ${token}`;
    console.log("Интерцептор прикрепили");
  } else {
    console.warn("Не получилось");
  }

  return config;
};

$authHost.interceptors.request.use(authInterceptor);

$authHost.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export { $authHost, $host };
