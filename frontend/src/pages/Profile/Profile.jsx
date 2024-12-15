import { Empty, message, Table } from "antd";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaCopy } from "react-icons/fa";
import useAuthStore from "../../stores/authStore";
import useEditProfilePictureModalStore from "../../stores/editProfilePictureModalStore";
import useTransactionPackageStore from "../../stores/transactionPackageStore";
import useTransferPointsModalStore from "../../stores/transferPointsModalStore";
import useTransferPointsStore from "../../stores/transferPointsStore";
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

  const sortedUserPackages = [...userPackages]?.sort(
    (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
  );

  const sortedTransferHistory = [...transferHistory]?.sort(
    (a, b) => new Date(b.dateTransferred) - new Date(a.dateTransferred)
  );

  return (
    <>
      <h1 className="text-center text-xl md:text-3xl font-bold mt-2">
        Profile
      </h1>
      <div className="section__container-2">
        <div className="flex flex-col gap-6 md:flex-row justify-around items-center">
          <div className="flex gap-4 items-center relative p-2">
            <div
              className="absolute -left-1 bottom-1 text-2xl cursor-pointer"
              onClick={handleEditProfilePictureModal}
            >
              <CiEdit />
            </div>
            <img
              className="w-24 h-24 rounded-full"
              src={`/avatar/${userInfo?.userProfile}.png`}
              alt="icon"
            />
            <div className="flex flex-col text-sm md:text-lg">
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
          <div className="flex justify-around gap-6">
            <div className="flex flex-col items-center gap-2">
              <span>My Membership Level</span>
              <img
                className="h-10 w-32"
                src={`/vip/${userInfo?.membershipLevel}.png`}
                alt="icon"
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span>My Total Points</span>
              <span className="text-xl md:text-3xl font-bold">
                {userInfo?.points}
              </span>
            </div>
          </div>
        </div>
        <div className="my-4">
          <button onClick={handleTransferPointsModal} className="btn">
            Transfer Points
          </button>
        </div>
        <div className="flex justify-center">
          <div className="profile-history-container">
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
              <h2 className="text-center text-lg md:text-2xl font-bold my-4">
                My Transactions
              </h2>
              {loading && <p>Loading transactions...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {!loading &&
                !error &&
                (sortedUserPackages?.length > 0 ? (
                  <div className="table-responsive">
                    <Table
                      dataSource={sortedUserPackages}
                      columns={packageColumns}
                      rowKey="_id"
                      pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: sortedUserPackages?.length,
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
              <h2 className="text-center text-lg md:text-2xl font-bold my-4">
                My Transfer History
              </h2>
              {transferLoading && <p>Loading transfer history...</p>}
              {transferError && <p className="text-red-500">{transferError}</p>}
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
    </>
  );
}
