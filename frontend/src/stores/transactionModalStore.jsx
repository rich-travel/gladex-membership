import { create } from "zustand";

const useTransactionModalStore = create((set) => ({
  transactionModal: false,
  handleTransactionModal: () => set((state) => ({ transactionModal: !state.transactionModal })),
}));

export default useTransactionModalStore;
