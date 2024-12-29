import { create } from "zustand";

const useEditMembershipLevelModalStore = create((set) => ({
  editMembershipLevelModal: false,
  editingMembershipLevel: null,
  handleEditMembershipLevelModal: (isOpen) =>
    set({ editMembershipLevelModal: isOpen }),
  setEditingMembershipLevel: (level) => set({ editingMembershipLevel: level }),
}));

export default useEditMembershipLevelModalStore;
