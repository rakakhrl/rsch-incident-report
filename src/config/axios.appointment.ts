import Axios, { type InternalAxiosRequestConfig } from "axios";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  return config;
}

export const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_MOBILE2,
});

axios.interceptors.request.use(authRequestInterceptor);
