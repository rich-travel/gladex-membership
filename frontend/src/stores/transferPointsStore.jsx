import { create } from "zustand";
import api from "../services/api"; // Import the Axios instance

const useTransferPointsStore = create((set) => ({
  transferHistory: [],
  loading: false,
  error: null,

  // Function to transfer points
  transferPoints: async (fromMembershipId, toMembershipId, points) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/api/transfer/transfer-points", {
        fromMembershipId,
        toMembershipId,
        points,
      });
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Function to fetch all transfer history
  fetchAllTransferHistory: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/api/transfer/transfer-history");
      set({ transferHistory: response.data.history, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // Function to fetch transfer history of a specific user
  fetchTransferHistory: async (membershipId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/api/transfer/${membershipId}`);
      set({ transferHistory: response.data.history, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },
}));

export default useTransferPointsStore;
