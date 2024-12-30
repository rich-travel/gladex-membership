import { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { FaCopy } from "react-icons/fa";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";
import logo from "../../assets/images/logo.png";
import DashboardLayout from "../../components/DashboardLayout";
import useAuthStore from "../../stores/authStore";
import { copyToClipboard } from "../../utils/GeneralHelper";
import "./LoyaltyCard.css";

export default function LoyaltyCard() {
  const { userInfo } = useAuthStore();
  const barcodeValue = userInfo?.membershipId;
  const [showMembershipId, setShowMembershipId] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  return (
    <>
      <DashboardLayout title="Loyalty Card" />
      <div className="section__container-2">
        <div className="flex flex-col items-center p-4">
          <div className="card-layout shadow-xl relative">
            <div className="card-text font-bold absolute  pl-4">
              E-Loyalty Card
            </div>
            <div className="card-name font-semibold">
              {userInfo?.firstName} {userInfo?.lastName}
            </div>
            <div className="card-number font-semibold">
              {showMembershipId ? formattedMembershipId : maskedMembershipId}
              <button className="ml-8" onClick={toggleMembershipIdVisibility}>
                {showMembershipId ? <PiEyeBold /> : <PiEyeClosedBold />}
              </button>
              {showMembershipId && (
                <button
                  className="ml-2"
                  onClick={() => copyToClipboard(userInfo?.membershipId)}
                >
                  <FaCopy className="icon-orange text-lg md:text-3xl" />
                </button>
              )}
            </div>
            <div>
              <div className="barcode">
                <Barcode
                  value={barcodeValue}
                  height={windowWidth < 900 ? 22 : 40}
                  displayValue={false}
                  width={windowWidth < 900 ? 1.5 : 2}
                  background="#eeeeee"
                />
              </div>
              <img className="img-logo" src={logo} alt="logo" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
