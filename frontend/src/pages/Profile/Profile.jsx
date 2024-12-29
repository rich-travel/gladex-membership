import { Empty } from "antd";
import { useEffect } from "react";
import { BiTransfer } from "react-icons/bi";
import { FaCopy } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import useAuthStore from "../../stores/authStore";
import useEditProfilePictureModalStore from "../../stores/editProfilePictureModalStore";
import useTransactionPackageStore from "../../stores/transactionPackageStore";
import useTransferPointsModalStore from "../../stores/transferPointsModalStore";
import useTransferPointsStore from "../../stores/transferPointsStore";
import {
  copyToClipboard,
  formatCurrency,
  getCurrencyInfo,
} from "../../utils/GeneralHelper";
import "./Profile.css";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

export default function Profile() {
  const { userInfo } = useAuthStore();
  const { userPackages, fetchUserPackages } = useTransactionPackageStore();
  const fetchUserInfo = useAuthStore((state) => state.fetchUserInfo);
  const fetchMembershipLevel = useAuthStore(
    (state) => state.fetchMembershipLevel
  );

  const handleTransferPointsModal = useTransferPointsModalStore(
    (state) => state.handleTransferPointsModal
  );
  const handleEditProfilePictureModal = useEditProfilePictureModalStore(
    (state) => state.handleEditProfilePictureModal
  );
  const { transferHistory, fetchTransferHistory } = useTransferPointsStore();

  useEffect(() => {
    if (userInfo?.membershipId) {
      fetchUserPackages(userInfo?.membershipId);
      fetchUserInfo(userInfo?.membershipId);
      fetchTransferHistory(userInfo?.membershipId);
      fetchMembershipLevel(userInfo?.membershipId);
    }
  }, [
    userInfo,
    fetchUserPackages,
    fetchUserInfo,
    fetchTransferHistory,
    fetchMembershipLevel,
  ]);

  const currencyInfo = getCurrencyInfo();

  const sortedUserPackages = userPackages
    ? [...userPackages]?.sort(
        (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
      )
    : [];

  const sortedTransferHistory = transferHistory
    ? [...transferHistory]?.sort(
        (a, b) => new Date(b.dateTransferred) - new Date(a.dateTransferred)
      )
    : [];

  return (
    <>
      <DashboardLayout title="Profile" />
      <div className="section__container-2">
        <div className="flex flex-col gap-6 md:flex-row justify-around items-center">
          <div className="flex gap-4 items-center relative p-2">
            <div
              className="absolute -left-1 bottom-2 text-1xl cursor-pointer"
              onClick={handleEditProfilePictureModal}
            >
              <FiEdit />
            </div>
            <img
              className="w-24 h-24 rounded-full"
              src={`/avatar/${userInfo?.userProfile}.png`}
              alt="icon"
            />
            <div className="flex flex-col text-sm md:text-lg font-semibold">
              <span className="flex items-center gap-2">
                {userInfo?.membershipId}{" "}
                <span
                  className="icon-blue cursor-pointer"
                  onClick={() => copyToClipboard(userInfo?.membershipId)}
                >
                  <FaCopy />
                </span>
              </span>
              <span className="capitalize">
                {userInfo?.firstName} {userInfo?.lastName}
              </span>
              <span>{userInfo?.email}</span>
            </div>
          </div>
          <div className="my-4">
            <button
              onClick={handleTransferPointsModal}
              className="btn flex justify-center items-center gap-2"
            >
              <BiTransfer className="text-xl" />
              <span>Transfer Points</span>
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:justify-center md:items-baseline gap-6 md:mt-6">
          <div className="left-section flex justify-around gap-6 flex-col">
            <div className="flex flex-col items-center gap-2">
              <span className="font-semibold">My Membership Level</span>
              <img
                className="w-52 h-36"
                src={`/vip/${userInfo?.membershipLevel}.png`}
                alt="icon"
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-semibold">My Total Points</span>
              <span className="text-2xl md:text-4xl font-bold">
                {userInfo?.points}
              </span>
            </div>
          </div>
          <div className="right-section">
            <div>
              <div className="flex justify-between font-semibold mb-2">
                <span>Points Earned</span>
                {sortedUserPackages?.length > 4 && (
                  <Link to="/points-history">
                    <span className="text-orange-500 cursor-pointer">
                      See All
                    </span>
                  </Link>
                )}
              </div>
              <div>
                {sortedUserPackages?.length > 0 ? (
                  <div className="points-wrapper">
                    {sortedUserPackages?.map((item, index) => (
                      <div key={index} className="points-card">
                        <div>{item?.packageAvailed}</div>
                        <div className="flex justify-between">
                          <span>
                            {currencyInfo.symbol}
                            {formatCurrency(item?.packagePrice)}
                          </span>
                          <span className="text-green-600 font-semibold">
                            +{currencyInfo.symbol}
                            {formatCurrency(item?.earnPoints)}
                          </span>
                        </div>
                        <div className="text-gray-500 text-xs mt-2">
                          {new Date(item?.dateCreated).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty description="No Points Earned" />
                )}
              </div>
              <div className="flex justify-between font-semibold mb-2 mt-4">
                <span>Transfer Points History</span>
                {sortedTransferHistory?.length > 4 && (
                  <Link to="/transfer-history">
                    <span className="text-orange-500 cursor-pointer">
                      See All
                    </span>
                  </Link>
                )}
              </div>
              <div>
                {sortedTransferHistory?.length > 0 ? (
                  <div className="points-wrapper">
                    {sortedTransferHistory?.map((item, index) => {
                      const totalPoints =
                        item?.pointsTransferred + item?.transferFee;
                      const isReceived =
                        item?.toMembershipId === userInfo?.membershipId;
                      return (
                        <div key={index} className="points-card">
                          <div className="flex justify-between">
                            <span>{isReceived ? "From:" : "To:"}</span>
                            <span className="capitalize">
                              {isReceived
                                ? item?.fromFullName
                                : item?.toFullName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fee:</span>
                            <span className="text-red-500 font-semibold">
                              -{currencyInfo.symbol}
                              {formatCurrency(item?.transferFee)}
                            </span>
                          </div>
                          <div className="flex justify-between border-b-2 border-gray-500 pb-2">
                            <span>Amount:</span>
                            <span
                              className={
                                isReceived
                                  ? "text-green-600 font-semibold"
                                  : "text-red-500 font-semibold"
                              }
                            >
                              {isReceived ? "+" : "-"}
                              {currencyInfo.symbol}
                              {formatCurrency(item?.pointsTransferred)}
                            </span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span>{isReceived ? "Received" : "Deducted"}:</span>
                            <span
                              className={
                                isReceived
                                  ? "text-green-600 font-semibold"
                                  : "text-red-500 font-semibold"
                              }
                            >
                              {isReceived ? "+" : "-"}
                              {currencyInfo.symbol}
                              {isReceived
                                ? item?.pointsTransferred
                                : totalPoints}
                            </span>
                          </div>
                          <div className="text-gray-500 text-xs mt-2">
                            {new Date(item?.dateTransferred).toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Empty description="No Transfer History" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
