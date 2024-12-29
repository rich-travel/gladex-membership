import { Button, Empty, Pagination, Table } from "antd";
import PropTypes from "prop-types";
import EditMemberLevelModal from "../../../components/Modals/EditMemberLevelModal/EditMemberLevelModal";
import useEditMembershipLevelModalStore from "../../../stores/editMembershipLevelModalStore";
import useMembershipLevelStore from "../../../stores/membershipLevelStore";
import { formatCurrency } from "../../../utils/GeneralHelper";

export default function MembershipLevels({
  getColumnSearchProps,
  currencyInfo,
  handlePageChange,
  currentPage,
  pageSize,
}) {
  const {
    membershipLevels,
    loading: membershipLoading,
    error: membershipError,
  } = useMembershipLevelStore();

  const { handleEditMembershipLevelModal, setEditingMembershipLevel } =
    useEditMembershipLevelModalStore();

  const showEditModal = (record) => {
    setEditingMembershipLevel(record);
    handleEditMembershipLevelModal(true);
  };

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
      render: (text) => `${currencyInfo?.symbol}${formatCurrency(text)}`,
    },
    {
      title: "Transfer Fee",
      dataIndex: "transferFee",
      key: "transferFee",
      render: (text) => `${currencyInfo?.symbol}${formatCurrency(text)}`,
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
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => showEditModal(record)}>
          Edit
        </Button>
      ),
    },
  ];

  const sortedMembershipLevels = membershipLevels
    ? [...membershipLevels]?.sort(
        (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
      )
    : [];

  const paginatedMembershipLevels = sortedMembershipLevels?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <h2 className="text-center text-lg md:text-2xl font-bold my-4">
        All Membership Levels
      </h2>
      {membershipLoading && <p>Loading membership levels...</p>}
      {membershipError && <p className="text-red-500">{membershipError}</p>}
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

      <EditMemberLevelModal />
    </>
  );
}

MembershipLevels.propTypes = {
  getColumnSearchProps: PropTypes.func.isRequired,
  currencyInfo: PropTypes.object.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
};
