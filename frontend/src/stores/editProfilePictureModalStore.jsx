import { create } from "zustand";

const useEditProfilePictureModalStore = create((set) => ({
  editProfilePictureModal: false,
  handleEditProfilePictureModal: () =>
    set((state) => ({ editProfilePictureModal: !state.editProfilePictureModal })),
}));

export default useEditProfilePictureModalStore;
