import { create } from "zustand";

const useMembershipLevelModalStore = create((set) => ({
  membershipLevelModal: false,
  handleMemberhipLevelModal: () => set((state) => ({ membershipLevelModal: !state.membershipLevelModal })),
}));

export default useMembershipLevelModalStore;
