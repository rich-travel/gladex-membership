import { Empty, Pagination, Table } from "antd";
import PropTypes from "prop-types";
import useTransferPointsStore from "../../../stores/transferPointsStore";
import { formatCurrency } from "../../../utils/GeneralHelper";
export default function TransferPoints({
  getColumnSearchProps,
  currencyInfo,
  handlePageChange,
  currentPage,
  pageSize,
}) {
  const {
    transferHistory,
    loading: transferLoading,
    error: transferError,
  } = useTransferPointsStore();

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
      render: (text) => `${currencyInfo?.symbol}${formatCurrency(text)}`,
      // ...getColumnSearchProps("pointsTransferred"),
    },
    {
      title: "Transfer Fee",
      dataIndex: "transferFee",
      key: "transferFee",
      render: (text) => `${currencyInfo?.symbol}${formatCurrency(text)}`,
      // ...getColumnSearchProps("transferFee"),
    },
    {
      title: "Date Transferred",
      dataIndex: "dateTransferred",
      key: "dateTransferred",
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  const sortedTransferHistory = transferHistory
    ? [...transferHistory]?.sort(
        (a, b) => new Date(b.dateTransferred) - new Date(a.dateTransferred)
      )
    : [];

  const paginatedTransferHistory = sortedTransferHistory?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
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
  );
}

TransferPoints.propTypes = {
  getColumnSearchProps: PropTypes.func.isRequired,
  currencyInfo: PropTypes.object.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
};
