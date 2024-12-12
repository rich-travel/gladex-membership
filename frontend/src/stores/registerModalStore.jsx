import { create } from "zustand";

const useRegisterModalStore = create((set) => ({
  registerModal: false,
  handleRegisterModal: () =>
    set((state) => ({ registerModal: !state.registerModal })),
}));

export default useRegisterModalStore;
