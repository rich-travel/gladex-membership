import { create } from "zustand";
import api from "../services/api"; // Import the Axios instance

const useTransactionPackageStore = create((set) => ({
  packages: [],
  loading: false,
  error: null,
  userPackages: [],

  // Fetch all packages
  fetchAllPackages: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/api/package/all-packages");
      set({ packages: response.data.packages, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  // Add package to user
  addPackageToUser: async (packageData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/api/package/add-package", packageData);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      throw error;
    }
  },

  // Fetch packages for a specific user
  fetchUserPackages: async (membershipId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/api/package/${membershipId}`);
      set({ userPackages: response.data.packages, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },
}));

export default useTransactionPackageStore;