import { create } from "zustand";
import api from "../services/api"; // Import the Axios instance

const useMembershipLevelStore = create((set) => ({
  membershipLevels: [],
  membershipLevel: null,
  loading: false,
  error: null,

  // Function to add a membership level
  addMembershipLevel: async (membershipLevelData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(
        "/api/membership-level/add",
        membershipLevelData
      );
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

  // Function to fetch all membership levels
  fetchAllMembershipLevels: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/api/membership-level/all");
      set({ membershipLevels: response.data.membershipLevels, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // Function to fetch a specific membership level by ID
  fetchMembershipLevelById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/api/membership-level/${id}`);
      set({ membershipLevel: response.data.membershipLevel, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // Function to edit a membership level
  editMembershipLevel: async (id, membershipLevelData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(
        `/api/membership-level/edit/${id}`,
        membershipLevelData
      );
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
}));

export default useMembershipLevelStore;
