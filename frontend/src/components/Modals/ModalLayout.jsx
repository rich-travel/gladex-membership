import AddMemberLevelModal from "./AddMemberLevelModal/AddMemberLevelModal";
import ChangeAdminModal from "./ChangeAdminModal/ChangeAdminModal";
import EditProfilePicture from "./EditProfilePictureModal/EditProfilePictureModal";
import LoginModal from "./LoginModal/LoginModal";
import RegisterModal from "./RegisterModal/RegisterModal";
import TransactionModal from "./TransactionModal/TransactionModal";
import TransferPointsModal from "./TransferPointsModal/TransferPointsModal";

export default function ModalLayout() {
  return (
    <>
      <LoginModal />
      <RegisterModal />
      <TransactionModal />
      <ChangeAdminModal />
      <TransferPointsModal />
      <EditProfilePicture />
      <AddMemberLevelModal />
    </>
  );
}
