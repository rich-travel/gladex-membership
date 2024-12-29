import { useState } from "react";
import Barcode from "react-barcode";
import { FaCopy } from "react-icons/fa";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";
import logo from "../../assets/images/logo.png";
import useAuthStore from "../../stores/authStore";
import { copyToClipboard } from "../../utils/GeneralHelper";
import "./LoyaltyCard.css";
import DashboardLayout from "../../components/DashboardLayout";

export default function LoyaltyCard() {
  const { userInfo } = useAuthStore();
  const barcodeValue = userInfo?.membershipId;
  const [showMembershipId, setShowMembershipId] = useState(false);

  const toggleMembershipIdVisibility = () => {
    setShowMembershipId(!showMembershipId);
  };

  const formatMembershipId = (membershipId) => {
    return membershipId.replace(/(.{4})/g, "$1 ").trim();
  };

  const maskedMembershipId = userInfo?.membershipId
    ? formatMembershipId(userInfo.membershipId.replace(/.(?=.{4})/g, "*"))
    : "";

  const formattedMembershipId = userInfo?.membershipId
    ? formatMembershipId(userInfo.membershipId)
    : "";

  return (
    <>
      <DashboardLayout title="Loyalty Card" />
      <div className="section__container-2">
        <div className="flex flex-col items-center p-4">
          <div className="card-layout shadow-xl relative">
            <div className="ml-4 text-xl md:text-4xl font-medium">
              Membership Card
            </div>
            <div className="flex items-center text-xl md:text-4xl font-bold mt-6 ml-4">
              {showMembershipId ? formattedMembershipId : maskedMembershipId}
              <button className="ml-8" onClick={toggleMembershipIdVisibility}>
                {showMembershipId ? <PiEyeBold /> : <PiEyeClosedBold />}
              </button>
              {showMembershipId && (
                <button
                  className="ml-2"
                  onClick={() => copyToClipboard(userInfo?.membershipId)}
                >
                  <FaCopy className="icon-blue text-lg md:text-3xl" />
                </button>
              )}
            </div>
            <div>
              <div className="mt-4 absolute bottom-4 left-4">
                <Barcode
                  value={barcodeValue}
                  height={40}
                  displayValue={false}
                  width={3}
                />
              </div>
              <img
                className="h-14 w-16 absolute bottom-4 right-4"
                src={logo}
                alt="logo"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
