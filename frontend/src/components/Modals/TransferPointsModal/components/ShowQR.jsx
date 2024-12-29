import { Input } from "antd";
import html2canvas from "html2canvas";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { RiDownloadLine } from "react-icons/ri";
import QRCode from "react-qr-code";
import Swal from "sweetalert2";
import logo from "../../../../assets/images/logo.png";
import useAuthStore from "../../../../stores/authStore";
import {
  formatCurrency,
  getCurrencyInfo,
  maskMembershipId,
} from "../../../../utils/GeneralHelper";

export default function ShowQR() {
  const { userInfo } = useAuthStore();
  const [pointsToAdd, setPointsToAdd] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [qrValue, setQrValue] = useState(
    JSON.stringify({ membershipId: userInfo?.membershipId })
  );

  const currencyInfo = getCurrencyInfo();

  const handleTab = (tab) => {
    setActiveTab(tab);
  };

  const handleSavePoints = () => {
    const points =
      pointsToAdd === "0" ? Math.floor(Math.random() * 1000) : pointsToAdd;
    setQrValue(
      JSON.stringify({
        membershipId: userInfo?.membershipId,
        points: points,
      })
    );
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Points added successfully.",
    });
    setActiveTab(0);
  };

  const handleDownloadQR = () => {
    const element = document.querySelector(".bg-slate-100");
    html2canvas(element).then((canvas) => {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qr-code.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <div>
        {activeTab === 0 ? (
          <>
            <div className="flex flex-col items-center px-10 bg-slate-100 rounded-xl">
              <img src={logo} alt="logo" className="w-20 h-20" />
              <span className="text-lg font-bold uppercase">
                {userInfo?.firstName} {userInfo?.lastName}
              </span>
              <span className="text-lg font-bold mb-4">
                {maskMembershipId(userInfo?.membershipId)}
              </span>
              <QRCode value={qrValue} />
              {pointsToAdd && (
                <span className="mt-4 text-lg font-bold">
                  Points: {currencyInfo?.symbol}{" "}
                  {formatCurrency(
                    pointsToAdd === "0"
                      ? Math.floor(Math.random() * 1000) + 1
                      : pointsToAdd
                  )}
                </span>
              )}
              <span className="mt-4 mb-4 text-xs">Transfer fees may apply</span>
            </div>
            <div className="flex flex-col items-center gap-4 mt-4">
              <div
                onClick={() => handleTab(1)}
                className="btn w-full flex items-center justify-center gap-2"
              >
                <FaPlusCircle className="text-xl" />
                <span>Add Points</span>
              </div>

              <div
                className="btn-brand w-full flex items-center justify-center gap-2"
                onClick={handleDownloadQR}
              >
                <RiDownloadLine className="text-xl" />
                <span>Download QR</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-slate-200 w-80 p-6 rounded-xl">
              <div className="flex justify-between">
                <div>Add Amount</div>
                <IoCloseSharp
                  onClick={() => handleTab(0)}
                  className="cursor-pointer text-xl"
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <Input
                  className="mt-4"
                  placeholder="Enter the amount of points to add"
                  value={pointsToAdd}
                  onChange={(e) => setPointsToAdd(e.target.value)}
                />
                <div
                  className="btn w-full flex items-center justify-center gap-2 mt-4"
                  onClick={handleSavePoints}
                >
                  Save
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
