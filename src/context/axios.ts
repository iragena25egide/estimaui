import axios from "axios";

const API = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "https://estimapp-1.onrender.com/api/estimaApp", 
});

API.interceptors.request.use((config) => {
	const token = localStorage.getItem("authToken");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default API;