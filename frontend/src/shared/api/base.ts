import axios, { AxiosInstance } from "axios";
import { AuthResponse } from "./services/Auth/types";
import { API_URL } from "./api_url";

function createInstance(): AxiosInstance {
    const instance = axios.create({
        withCredentials: true,
        baseURL: import.meta.env.VITE_BASE_URL,
    });

    instance.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
        return config;
    });

    instance.interceptors.response.use((response) => {
        return response;
    }, async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._isRetry) {
            originalRequest._isRetry = true;
            try {
                const response = await axios.get<AuthResponse>(API_URL.refresh(), { withCredentials: true });
                localStorage.setItem('token', response.data.accessToken);
                return instance.request(originalRequest);
            } catch (refreshError) {
                console.error('Auth check error:', refreshError);
            }
        }
        return Promise.reject(error);
    });

    return instance;
}

export const baseInstanceV1 = createInstance();
