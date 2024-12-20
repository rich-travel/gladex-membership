import { Empty, message, Table } from "antd";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { FaCopy } from "react-icons/fa";
import useAuthStore from "../../stores/authStore";
import useTransactionPackageStore from "../../stores/transactionPackageStore";
import useTransferPointsModalStore from "../../stores/transferPointsModalStore";
import useTransferPointsStore from "../../stores/transferPointsStore";
import useEditProfilePictureModalStore from "../../stores/editProfilePictureModalStore";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuthStore();
  const { userPackages, fetchUserPackages, loading, error } =
    useTransactionPackageStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTab, setSelectedTab] = useState("transactions");
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
  const { userInfo } = useAuthStore();
  const {
    transferHistory,
    fetchTransferHistory,
    loading: transferLoading,
    error: transferError,
  } = useTransferPointsStore();

  useEffect(() => {
    if (user?.membershipId) {
      fetchUserPackages(user?.membershipId);
      fetchUserInfo(user?.membershipId);
      fetchTransferHistory(user?.membershipId);
      fetchMembershipLevel(user?.membershipId);
    }
  }, [
    user,
    fetchUserPackages,
    fetchUserInfo,
    fetchTransferHistory,
    fetchMembershipLevel,
  ]);

  const packageColumns = [
    {
      title: "Package",
      dataIndex: "packageAvailed",
      key: "packageAvailed",
    },
    {
      title: "Price",
      dataIndex: "packagePrice",
      key: "packagePrice",
      render: (text) => `₱${text}`,
    },
    {
      title: "Earned Points",
      dataIndex: "earnPoints",
      key: "earnPoints",
      render: (text) => `₱${text}`,
    },
    {
      title: "Date",
      dataIndex: "dateCreated",
      key: "dateCreated",
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  const transferColumns = [
    {
      title: "To Membership ID",
      dataIndex: "toMembershipId",
      key: "toMembershipId",
    },
    {
      title: "Full Name",
      dataIndex: "toFullName",
      key: "toFullName",
    },
    {
      title: "Points Transferred",
      dataIndex: "pointsTransferred",
      key: "pointsTransferred",
    },
    {
      title: "Transfer Fee",
      dataIndex: "transferFee",
      key: "transferFee",
    },
    {
      title: "Date Transferred",
      dataIndex: "dateTransferred",
      key: "dateTransferred",
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success("Membership ID copied to clipboard");
      })
      .catch((err) => {
        message.error("Failed to copy Membership ID", err);
      });
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

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
      <h1 className="text-center text-xl md:text-3xl font-bold mt-4">
        Profile
      </h1>
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
            <button onClick={handleTransferPointsModal} className="btn">
              Transfer Points
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:justify-center md:items-baseline gap-6">
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
              <span className="text-1xl md:text-4xl font-bold">
                {userInfo?.points}
              </span>
            </div>
          </div>
          <div className="right-section">
            <div className="flex justify-center">
              <div className="profile-history-container w-full flex justify-around gap-4 font-bold">
                <button
                  className={`tab-history-profile ${
                    selectedTab === "transactions" ? "active" : ""
                  }`}
                  onClick={() => setSelectedTab("transactions")}
                >
                  Transaction History
                </button>
                <button
                  className={`tab-history-profile ${
                    selectedTab === "transfers" ? "active" : ""
                  }`}
                  onClick={() => setSelectedTab("transfers")}
                >
                  Transfer Points History
                </button>
              </div>
            </div>
            <div>
              {selectedTab === "transactions" && (
                <>
                  {loading && <p>Loading transactions...</p>}
                  {error && <p className="text-red-500">{error}</p>}
                  {!loading &&
                    !error &&
                    (sortedUserPackages.length > 0 ? (
                      <div className="table-responsive">
                        <Table
                          dataSource={sortedUserPackages}
                          columns={packageColumns}
                          rowKey="_id"
                          pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: sortedUserPackages.length,
                            showSizeChanger: true,
                            pageSizeOptions: ["10", "20", "50"],
                          }}
                          onChange={handleTableChange}
                        />
                      </div>
                    ) : (
                      <Empty description="No Transactions Found" />
                    ))}
                </>
              )}
              {selectedTab === "transfers" && (
                <>
                  {transferLoading && <p>Loading transfer history...</p>}
                  {transferError && (
                    <p className="text-red-500">{transferError}</p>
                  )}
                  {!transferLoading &&
                    !transferError &&
                    (sortedTransferHistory?.length > 0 ? (
                      <div className="table-responsive">
                        <Table
                          dataSource={sortedTransferHistory}
                          columns={transferColumns}
                          rowKey="_id"
                          pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: sortedTransferHistory?.length,
                            showSizeChanger: true,
                            pageSizeOptions: ["10", "20", "50"],
                          }}
                          onChange={handleTableChange}
                        />
                      </div>
                    ) : (
                      <Empty description="No Transfer History Found" />
                    ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
