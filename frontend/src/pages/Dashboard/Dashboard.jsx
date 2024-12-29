import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { FaPlusCircle, FaUserPlus } from "react-icons/fa";
import useAuthStore from "../../stores/authStore";
import useChangeAdminModalStore from "../../stores/changeAdminModalStore";
import useMembershipLevelModalStore from "../../stores/membershipLevelModalStore";
import useMembershipLevelStore from "../../stores/membershipLevelStore";
import useTransactionModalStore from "../../stores/transactionModalStore";
import useTransactionPackageStore from "../../stores/transactionPackageStore";
import useTransferPointsStore from "../../stores/transferPointsStore";
import { getCurrencyInfo } from "../../utils/GeneralHelper";
import "./Dashboard.css";
import Admins from "./component/Admins";
import Members from "./component/Members";
import MembershipLevels from "./component/MembershipLevels";
import Transaction from "./component/Transactions";
import TransferPoints from "./component/TransferPoints";
import DashboardLayout from "../../components/DashboardLayout";

const { Option } = Select;

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

  const { fetchAllPackages } = useTransactionPackageStore();
  const { fetchAllTransferHistory } = useTransferPointsStore();
  const { fetchAllMembershipLevels } = useMembershipLevelStore();
  const { fetchAllUsers } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedTab, setSelectedTab] = useState("transactions");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const searchInput = useRef(null);

  useEffect(() => {
    fetchAllPackages();
    fetchAllTransferHistory();
    fetchAllMembershipLevels();
    fetchAllUsers();

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
            type="secondary"
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

  const currencyInfo = getCurrencyInfo();

  const memberColumns = [
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

  const handleTabChange = (value) => {
    setSelectedTab(value);
  };

  return (
    <>
      <DashboardLayout title="Dashboard" />
      <div className="section__container-2">
        <div className="flex gap-2 flex-col md:flex-row md:justify-around">
          <button
            onClick={handleTransactionModal}
            className="btn flex justify-center items-center gap-2"
          >
            <FaPlusCircle className="text-xl" />
            <span>Transaction</span>
          </button>
          <button
            onClick={handleMemberhipLevelModal}
            className="btn flex justify-center items-center gap-2"
          >
            <FaPlusCircle className="text-xl" />
            <span>Member Level</span>
          </button>
          <button
            onClick={handleChangeAdminModal}
            className="btn flex justify-center items-center gap-2"
          >
            <FaUserPlus className="text-xl" />
            <span>Admin</span>
          </button>
        </div>
        <div
          className={`flex ${
            windowWidth < 900 ? "justify-start" : "justify-center"
          } mt-4`}
        >
          {windowWidth < 900 ? (
            <Select
              defaultValue={selectedTab}
              onChange={handleTabChange}
              style={{ width: 200 }}
            >
              <Option value="transactions">All Transactions</Option>
              <Option value="transfers">All Transfer History</Option>
              <Option value="membershipLevels">All Membership Levels</Option>
              <Option value="admins">All Admin Users</Option>
              <Option value="members">All Member Users</Option>
            </Select>
          ) : (
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
          )}
        </div>
        <div>
          {selectedTab === "transactions" && (
            <Transaction
              getColumnSearchProps={getColumnSearchProps}
              currencyInfo={currencyInfo}
              handlePageChange={handlePageChange}
              currentPage={currentPage}
              pageSize={pageSize}
            />
          )}
          {selectedTab === "transfers" && (
            <TransferPoints
              getColumnSearchProps={getColumnSearchProps}
              currencyInfo={currencyInfo}
              handlePageChange={handlePageChange}
              currentPage={currentPage}
              pageSize={pageSize}
            />
          )}
          {selectedTab === "membershipLevels" && (
            <MembershipLevels
              getColumnSearchProps={getColumnSearchProps}
              currencyInfo={currencyInfo}
              handlePageChange={handlePageChange}
              currentPage={currentPage}
              pageSize={pageSize}
            />
          )}
          {selectedTab === "admins" && (
            <Admins
              handlePageChange={handlePageChange}
              currentPage={currentPage}
              pageSize={pageSize}
              memberColumns={memberColumns}
            />
          )}
          {selectedTab === "members" && (
            <Members
              handlePageChange={handlePageChange}
              currentPage={currentPage}
              pageSize={pageSize}
              memberColumns={memberColumns}
            />
          )}
        </div>
      </div>
    </>
  );
}
