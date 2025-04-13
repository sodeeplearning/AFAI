import axios, { AxiosInstance } from "axios";


function createInstance(): AxiosInstance {
    const instance = axios.create({
        withCredentials: true,
        baseURL: import.meta.env.VITE_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    instance.interceptors.request.use((config) => {
        return config;
    });
    return instance;
}

export const baseInstanceV1 = createInstance();