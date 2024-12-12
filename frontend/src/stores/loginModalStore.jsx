import { create } from "zustand";

const useLoginModalStore = create((set) => ({
  loginModal: false,
  handleLoginModal: () => set((state) => ({ loginModal: !state.loginModal })),
}));

export default useLoginModalStore;
