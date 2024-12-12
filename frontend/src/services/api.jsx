import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/`, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in headers if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Example function to get data from MongoDB
export const getData = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching data:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

// Example function to post data to MongoDB
export const postData = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(
      "Error posting data:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

export default api;
