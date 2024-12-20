import { SearchOutlined } from "@ant-design/icons";
import { Button, Empty, Input, Pagination, Space, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import useAuthStore from "../../stores/authStore";
import useChangeAdminModalStore from "../../stores/changeAdminModalStore";
import useMembershipLevelModalStore from "../../stores/membershipLevelModalStore";
import useMembershipLevelStore from "../../stores/membershipLevelStore";
import useTransactionModalStore from "../../stores/transactionModalStore";
import useTransactionPackageStore from "../../stores/transactionPackageStore";
import useTransferPointsStore from "../../stores/transferPointsStore";
import "./Dashboard.css";

export default function Dashboard() {
  const handleTransactionModal = useTransactionModalStore(
    (state) => state.handleTransactionModal
  );

  const handleChangeAdminModal = useChangeAdminModalStore(
    (state) => state.handleChangeAdminModal
  );

  const handleMemberhipLevelModal = useMembershipLevelModalStore(
    (state) => state.handleMemberhipLevelModal
  );

  const { packages, fetchAllPackages, loading, error } =
    useTransactionPackageStore();
  const {
    transferHistory,
    fetchAllTransferHistory,
    loading: transferLoading,
    error: transferError,
  } = useTransferPointsStore();
  const {
    membershipLevels,
    fetchAllMembershipLevels,
    loading: membershipLoading,
    error: membershipError,
  } = useMembershipLevelStore();
  const { fetchAllUsers, allAdminUsers, allMemberUsers } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedTab, setSelectedTab] = useState("transactions");
  const searchInput = useRef(null);

  useEffect(() => {
    fetchAllPackages();
    fetchAllTransferHistory();
    fetchAllMembershipLevels();
    fetchAllUsers();
  }, [
    fetchAllPackages,
    fetchAllTransferHistory,
    fetchAllMembershipLevels,
    fetchAllUsers,
  ]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const packageColumns = [
    {
      title: "Membership ID",
      dataIndex: "membershipId",
      key: "membershipId",
      ...getColumnSearchProps("membershipId"),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      ...getColumnSearchProps("fullName"),
    },
    {
      title: "Package",
      dataIndex: "packageAvailed",
      key: "packageAvailed",
      ...getColumnSearchProps("packageAvailed"),
    },
    {
      title: "Price",
      dataIndex: "packagePrice",
      key: "packagePrice",
      render: (text) => `₱${text}`,
      ...getColumnSearchProps("packagePrice"),
    },
    {
      title: "Earned Points",
      dataIndex: "earnPoints",
      key: "earnPoints",
      render: (text) => `₱${text}`,
      ...getColumnSearchProps("earnPoints"),
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
      ...getColumnSearchProps("fromMembershipId"),
    },
    {
      title: "To Membership ID",
      dataIndex: "toMembershipId",
      key: "toMembershipId",
      ...getColumnSearchProps("toMembershipId"),
    },
    {
      title: "Points Transferred",
      dataIndex: "pointsTransferred",
      key: "pointsTransferred",
      ...getColumnSearchProps("pointsTransferred"),
    },
    {
      title: "Transfer Fee",
      dataIndex: "transferFee",
      key: "transferFee",
      ...getColumnSearchProps("transferFee"),
    },
    {
      title: "Date Transferred",
      dataIndex: "dateTransferred",
      key: "dateTransferred",
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  const membershipColumns = [
    {
      title: "Membership Name",
      dataIndex: "membershipName",
      key: "membershipName",
      ...getColumnSearchProps("membershipName"),
    },
    {
      title: "Membership Level",
      dataIndex: "membershipLevel",
      key: "membershipLevel",
      ...getColumnSearchProps("membershipLevel"),
    },
    {
      title: "Requirements Amount",
      dataIndex: "requirementsAmount",
      key: "requirementsAmount",
      ...getColumnSearchProps("requirementsAmount"),
    },
    {
      title: "Transfer Fee",
      dataIndex: "transferFee",
      key: "transferFee",
      ...getColumnSearchProps("transferFee"),
    },
    {
      title: "Benefits",
      dataIndex: "benefits",
      key: "benefits",
      render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} />,
    },
    {
      title: "Date Created",
      dataIndex: "dateCreated",
      key: "dateCreated",
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  const adminColumns = [
    {
      title: "Membership ID",
      dataIndex: "membershipId",
      key: "membershipId",
      ...getColumnSearchProps("membershipId"),
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      ...getColumnSearchProps("firstName"),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      ...getColumnSearchProps("lastName"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      ...getColumnSearchProps("mobileNumber"),
    },
  ];

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const sortedPackages = packages
    ? [...packages]?.sort(
        (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
      )
    : [];

  const sortedTransferHistory = transferHistory
    ? [...transferHistory]?.sort(
        (a, b) => new Date(b.dateTransferred) - new Date(a.dateTransferred)
      )
    : [];

  const sortedMembershipLevels = membershipLevels
    ? [...membershipLevels]?.sort(
        (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
      )
    : [];

  const sortedAdminUsers = allAdminUsers
    ? [...allAdminUsers]?.sort(
        (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
      )
    : [];
  const sortedMemberUsers = allMemberUsers
    ? [...allMemberUsers]?.sort(
        (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
      )
    : [];

  const paginatedPackages = sortedPackages?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const paginatedTransferHistory = sortedTransferHistory?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const paginatedMembershipLevels = sortedMembershipLevels?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const paginatedAdminUsers = sortedAdminUsers?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const paginatedMemberUsers = sortedMemberUsers?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <h1 className="text-center text-xl md:text-3xl font-bold mt-4">
        Admin Dashboard
      </h1>
      <div className="section__container-2">
        <div className="flex gap-2 flex-col md:flex-row md:justify-around">
          <button onClick={handleTransactionModal} className="btn">
            Create Transaction
          </button>
          <button onClick={handleMemberhipLevelModal} className="btn">
            Create Membership Level
          </button>
          <button onClick={handleChangeAdminModal} className="btn">
            Create Admin
          </button>
        </div>
        <div className="flex justify-center mt-4">
          <div className="dashboard-history-container flex justify-around w-full">
            <button
              className={`tab-history-dashboard ${
                selectedTab === "transactions" ? "active" : ""
              }`}
              onClick={() => setSelectedTab("transactions")}
            >
              All Transactions
            </button>
            <button
              className={`tab-history-dashboard ${
                selectedTab === "transfers" ? "active" : ""
              }`}
              onClick={() => setSelectedTab("transfers")}
            >
              All Transfer History
            </button>
            <button
              className={`tab-history-dashboard ${
                selectedTab === "membershipLevels" ? "active" : ""
              }`}
              onClick={() => setSelectedTab("membershipLevels")}
            >
              All Membership Levels
            </button>
            <button
              className={`tab-history-dashboard ${
                selectedTab === "admins" ? "active" : ""
              }`}
              onClick={() => setSelectedTab("admins")}
            >
              All Admin Users
            </button>
            <button
              className={`tab-history-dashboard ${
                selectedTab === "members" ? "active" : ""
              }`}
              onClick={() => setSelectedTab("members")}
            >
              All Member Users
            </button>
          </div>
        </div>
        <div>
          {selectedTab === "transactions" && (
            <>
              <h2 className="text-center text-lg md:text-2xl font-bold my-4">
                All Transactions
              </h2>
              {loading && <p>Loading transactions...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {!loading &&
                !error &&
                (paginatedPackages?.length > 0 ? (
                  <>
                    <div className="table-responsive">
                      <Table
                        dataSource={paginatedPackages}
                        columns={packageColumns}
                        rowKey="_id"
                        pagination={false}
                      />
                    </div>
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={packages?.length}
                      onChange={handlePageChange}
                      showSizeChanger
                      pageSizeOptions={["10", "20", "50"]}
                    />
                  </>
                ) : (
                  <Empty description="No Packages Found" />
                ))}
            </>
          )}
          {selectedTab === "transfers" && (
            <>
              <h2 className="text-center text-lg md:text-2xl font-bold my-4">
                All Transfer History
              </h2>
              {transferLoading && <p>Loading transfer history...</p>}
              {transferError && <p className="text-red-500">{transferError}</p>}
              {!transferLoading &&
                !transferError &&
                (paginatedTransferHistory?.length > 0 ? (
                  <>
                    <div className="table-responsive">
                      <Table
                        dataSource={paginatedTransferHistory}
                        columns={transferColumns}
                        rowKey="_id"
                        pagination={false}
                      />
                    </div>
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={transferHistory?.length}
                      onChange={handlePageChange}
                      showSizeChanger
                      pageSizeOptions={["10", "20", "50"]}
                    />
                  </>
                ) : (
                  <Empty description="No Transfer History Found" />
                ))}
            </>
          )}
          {selectedTab === "membershipLevels" && (
            <>
              <h2 className="text-center text-lg md:text-2xl font-bold my-4">
                All Membership Levels
              </h2>
              {membershipLoading && <p>Loading membership levels...</p>}
              {membershipError && (
                <p className="text-red-500">{membershipError}</p>
              )}
              {!membershipLoading &&
                !membershipError &&
                (paginatedMembershipLevels?.length > 0 ? (
                  <>
                    <div className="table-responsive">
                      <Table
                        dataSource={paginatedMembershipLevels}
                        columns={membershipColumns}
                        rowKey="_id"
                        pagination={false}
                      />
                    </div>
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={membershipLevels?.length}
                      onChange={handlePageChange}
                      showSizeChanger
                      pageSizeOptions={["10", "20", "50"]}
                    />
                  </>
                ) : (
                  <Empty description="No Membership Levels Found" />
                ))}
            </>
          )}
          {selectedTab === "admins" && (
            <>
              <h2 className="text-center text-lg md:text-2xl font-bold my-4">
                All Admin Users
              </h2>
              {allAdminUsers?.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <Table
                      dataSource={paginatedAdminUsers}
                      columns={adminColumns}
                      rowKey="membershipId"
                      pagination={false}
                    />
                  </div>
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={allAdminUsers?.length}
                    onChange={handlePageChange}
                    showSizeChanger
                    pageSizeOptions={["10", "20", "50"]}
                  />
                </>
              ) : (
                <Empty description="No Admin Users Found" />
              )}
            </>
          )}
          {selectedTab === "members" && (
            <>
              <h2 className="text-center text-lg md:text-2xl font-bold my-4">
                All Member Users
              </h2>
              {allMemberUsers?.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <Table
                      dataSource={paginatedMemberUsers}
                      columns={adminColumns}
                      rowKey="membershipId"
                      pagination={false}
                    />
                  </div>
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={allMemberUsers?.length}
                    onChange={handlePageChange}
                    showSizeChanger
                    pageSizeOptions={["10", "20", "50"]}
                  />
                </>
              ) : (
                <Empty description="No Admin Users Found" />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
