import { Empty, message, Table } from "antd";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaCopy } from "react-icons/fa";
import useAuthStore from "../../stores/authStore";
import useTransactionPackageStore from "../../stores/transactionPackageStore";
import useTransferPointsModalStore from "../../stores/transferPointsModalStore";
import useTransferPointsStore from "../../stores/transferPointsStore";
import useEditProfilePictureModalStore from "../../stores/editProfilePictureModalStore";

export default function Profile() {
  const { user } = useAuthStore();
  const { userPackages, fetchUserPackages, loading, error } =
    useTransactionPackageStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const fetchUserInfo = useAuthStore((state) => state.fetchUserInfo);

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
    }
  }, [user, fetchUserPackages, fetchUserInfo, fetchTransferHistory]);

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
      title: "From Membership ID",
      dataIndex: "fromMembershipId",
      key: "fromMembershipId",
    },
    {
      title: "To Membership ID",
      dataIndex: "toMembershipId",
      key: "toMembershipId",
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
        message.error("Failed to copy Membership ID");
      });
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <>
      <h1 className="text-center text-xl md:text-3xl font-bold">Profile</h1>
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
                src={`/vip/${user?.membershipLevel}.png`}
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
        <div>
          <h2 className="text-center text-lg md:text-2xl font-bold my-4">
            My Transactions
          </h2>
          {loading && <p>Loading transactions...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading &&
            !error &&
            (userPackages?.length > 0 ? (
              <Table
                dataSource={userPackages}
                columns={packageColumns}
                rowKey="_id"
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: userPackages.length,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50"],
                }}
                onChange={handleTableChange}
              />
            ) : (
              <Empty description="No Transactions Found" />
            ))}
        </div>
        <div>
          <h2 className="text-center text-lg md:text-2xl font-bold my-4">
            My Transfer History
          </h2>
          {transferLoading && <p>Loading transfer history...</p>}
          {transferError && <p className="text-red-500">{transferError}</p>}
          {!transferLoading &&
            !transferError &&
            (transferHistory?.length > 0 ? (
              <Table
                dataSource={transferHistory}
                columns={transferColumns}
                rowKey="_id"
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: transferHistory.length,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50"],
                }}
                onChange={handleTableChange}
              />
            ) : (
              <Empty description="No Transfer History Found" />
            ))}
        </div>
      </div>
    </>
  );
}
