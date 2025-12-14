import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { useRef } from 'react';

// Axios instance configuration
const createAxiosInstance = (): AxiosInstance => {
	const instance = axios.create({
		baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
		timeout: 10000,
		headers: {
			'Content-Type': 'application/json',
		},
		withCredentials: true,
	});

	// Request interceptor
	instance.interceptors.request.use(
		(config) => {
			// Note: session-token cookie is httpOnly, so it's automatically sent by the browser
			// No need to manually add Authorization header
			return config;
		},
		(error) => {
			return Promise.reject(error);
		},
	);

	// Response interceptor
	instance.interceptors.response.use(
		(response) => {
			return response;
		},
		(error) => {
			if (error.response?.status === 401) {
				// Handle unauthorized access - session cookie is invalid/expired
				// You might want to redirect to login page here
			}
			return Promise.reject(error);
		},
	);

	return instance;
};

// Global axios instance
let axiosInstance: AxiosInstance | null = null;

const getAxiosInstance = (): AxiosInstance => {
	if (!axiosInstance) {
		axiosInstance = createAxiosInstance();
	}
	return axiosInstance;
};

export function useAxios(): AxiosInstance {
	return useRef(getAxiosInstance()).current;
}
