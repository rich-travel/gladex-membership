import { Modal } from "antd";
import QRCode from "react-qr-code";
import useMyQrCodeModalStore from "../../../stores/myQrCodeModalStore";
import useAuthStore from "../../../stores/authStore";

export default function MyQRCode() {
  const qrCodeModal = useMyQrCodeModalStore((state) => state.qrCodeModal);
  const handleQrCodeModal = useMyQrCodeModalStore(
    (state) => state.handleQrCodeModal
  );
  const { userInfo } = useAuthStore();

  const userDetails = JSON.stringify({
    membershipId: userInfo?.membershipId,
    firstName: userInfo?.firstName,
    lastName: userInfo?.lastName,
    email: userInfo?.email,
    points: userInfo?.points,
    membershipLevel: userInfo?.membershipLevel,
  });

  return (
    <Modal
      title={null}
      open={qrCodeModal}
      onCancel={handleQrCodeModal}
      footer={null}
    >
      <div className="flex flex-col items-center p-4">
        <h1 className="text-xl font-bold mb-4">My QR Code</h1>
        {userInfo && <QRCode value={userDetails} />}
        <div className="mt-4 w-full max-w-xs">
          <div className="flex justify-between mb-2">
            <strong className="text-right">Membership ID:</strong>
            <span className="text-left">{userInfo?.membershipId}</span>
          </div>
          <div className="flex justify-between mb-2">
            <strong className="text-right">Name:</strong>
            <span className="text-left">
              {userInfo?.firstName} {userInfo?.lastName}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <strong className="text-right">Email:</strong>
            <span className="text-left">{userInfo?.email}</span>
          </div>
          <div className="flex justify-between mb-2">
            <strong className="text-right">Points:</strong>
            <span className="text-left">{userInfo?.points}</span>
          </div>
          <div className="flex justify-between mb-2">
            <strong className="text-right">Membership Level:</strong>
            <span className="text-left">{userInfo?.membershipLevel}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
