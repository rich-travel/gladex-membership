import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api, { postData } from "../services/api";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      userInfo: null,
      allAdminUsers: null,
      getMembershipLevel: null,

      // Log in function
      login: async (email, password) => {
        try {
          const response = await postData("/api/users/login", {
            email,
            password,
          });
          const { token, user } = response;

          // Update state
          set({ user, token, isAuthenticated: true });

          return response;
        } catch (error) {
          console.error(
            "Login failed:",
            error.response?.data?.message || error.message
          );
          throw error;
        }
      },

      // Log out function
      logout: () => {
        // Clear state and localStorage
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          userInfo: null,
        });
      },

      // Validate token function
      validateToken: async () => {
        const { token } = get(); // Get the current token
        if (token) {
          try {
            const response = await api.get("/api/users/validate-token", {
              headers: { Authorization: `Bearer ${token}` },
            });
            const { user } = response.data;

            // Update state
            set({ user, isAuthenticated: true });
          } catch (error) {
            console.error("Token validation failed:", error);
            set({ user: null, token: null, isAuthenticated: false }); // Clear state if invalid
          }
        }
      },

      // Fetch user info function
      fetchUserInfo: async (membershipId) => {
        try {
          const response = await api.get(`/api/users/${membershipId}`);
          const { user } = response.data;

          // Update state
          set({ userInfo: user });

          return user;
        } catch (error) {
          console.error("Fetching user info failed:", error);
          throw error;
        }
      },

      // Edit user profile function
      editUserProfile: async (membershipId, userProfile) => {
        try {
          const response = await api.put(
            `/api/users/${membershipId}/edit-profile`,
            {
              userProfile,
            }
          );
          const { user } = response.data;

          // Update state
          set({ userInfo: user });

          return user;
        } catch (error) {
          console.error("Editing user profile failed:", error);
          throw error;
        }
      },

      fetchMembershipLevel: async (membershipId) => {
        try {
          const response = await api.put(
            `/api/users/membership-level/${membershipId}`
          );
          const { membershipLevel } = response.data;
          set({ getMembershipLevel: membershipLevel });
          return membershipLevel;
        } catch (error) {
          console.error("Fetching membership level failed:", error);
          throw error;
        }
      },

      fetchAllAdminUsers: async () => {
        try {
          const response = await api.get(`/api/users/all-users`);
          const { users } = response.data;
          set({ allAdminUsers: users });
          return users;
        } catch (error) {
          console.error("Fetching all admin users failed:", error);
          throw error;
        }
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
