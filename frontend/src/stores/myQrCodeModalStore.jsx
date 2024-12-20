import { create } from "zustand";

const useMyQrCodeModalStore = create((set) => ({
  qrCodeModal: false,
  handleQrCodeModal: () => set((state) => ({ qrCodeModal: !state.qrCodeModal })),
}));

export default useMyQrCodeModalStore;
