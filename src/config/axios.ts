import Axios, { type InternalAxiosRequestConfig } from "axios";
import { decryptData } from "../utils/encryptDecrypt";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const user = localStorage.getItem("userID-value");

  if (user) {
    const userData = decryptData(user);
    config.headers["X-UserID"] = userData?.UserID;
  } else {
    config.headers["X-UserID"] =
      import.meta.env.VITE_API_ACCESSKEY_WHISTLEBLOWING;
  }

  config.headers.Encrypted = "{{encrypted}}";
  config.headers.AccessKey = import.meta.env.VITE_API_ACCESS_KEY;
  config.headers["Content-Type"] = "application/json";
  config.headers["EncryptionMethod"] = import.meta.env.VITE_API_ENC_METHOD;

  return config;
}

export const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axios.interceptors.request.use(authRequestInterceptor);
