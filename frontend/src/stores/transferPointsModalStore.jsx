import { create } from "zustand";

const useTransferPointsModalStore = create((set) => ({
  transferPointsModal: false,
  handleTransferPointsModal: () =>
    set((state) => ({ transferPointsModal: !state.transferPointsModal })),
}));

export default useTransferPointsModalStore;
