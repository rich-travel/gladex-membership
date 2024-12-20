import { Modal } from "antd";
import useEditProfilePictureModalStore from "../../../stores/editProfilePictureModalStore";
import { useState } from "react";
import useAuthStore from "../../../stores/authStore";
import Swal from "sweetalert2";

export default function EditProfilePicture() {
  const ProfilePictureData = Array.from({ length: 20 }, (_, i) => i + 1);

  const [userProfilePicture, setUserProfilePicture] = useState(null);

  const editProfilePictureModal = useEditProfilePictureModalStore(
    (state) => state.editProfilePictureModal
  );
  const handleEditProfilePictureModal = useEditProfilePictureModalStore(
    (state) => state.handleEditProfilePictureModal
  );

  const handleSelectProfilePicture = (picture) => {
    setUserProfilePicture(picture);
  };

  const { userInfo, editUserProfile } = useAuthStore();

  const handleSubmit = async () => {
    if (userProfilePicture === null) {
      Swal.fire({
        icon: "error",
        title: "No Picture Selected",
        text: "Please select a profile picture.",
      });
      return;
    }

    try {
      await editUserProfile(userInfo.membershipId, userProfilePicture);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile picture updated successfully.",
      });

      handleEditProfilePictureModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  return (
    <Modal
      title={null}
      footer={null}
      open={editProfilePictureModal}
      onCancel={handleEditProfilePictureModal}
    >
      <section>
        <div className="change-admin-container">
          <h3 className="text-center mb-3 font-bold text-lg">
            Edit Profile Picture
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {ProfilePictureData.map((picture) => (
              <div
                key={picture}
                onClick={() => handleSelectProfilePicture(picture)}
              >
                <img
                  className={`w-24 h-24 rounded-md cursor-pointer ${
                    userProfilePicture === picture ? "selected-img" : ""
                  }`}
                  src={`/avatar/${picture}.png`}
                  alt="icon"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center w-full justify-center">
            <button className="btn mt-4" onClick={handleSubmit}>
              Save
            </button>
          </div>
        </div>
      </section>
    </Modal>
  );
}
