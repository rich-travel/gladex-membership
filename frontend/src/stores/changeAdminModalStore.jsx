import { create } from "zustand";

const useChangeAdminModalStore = create((set) => ({
  changeAdminModal: false,
  handleChangeAdminModal: () =>
    set((state) => ({ changeAdminModal: !state.changeAdminModal })),
}));

export default useChangeAdminModalStore;
