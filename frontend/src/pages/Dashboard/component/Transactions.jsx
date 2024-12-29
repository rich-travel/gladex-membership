import { Empty, Pagination, Table } from "antd";
import PropTypes from "prop-types";
import useTransactionPackageStore from "../../../stores/transactionPackageStore";
import { formatCurrency } from "../../../utils/GeneralHelper";

export default function Transaction({
  getColumnSearchProps,
  currencyInfo,
  handlePageChange,
  currentPage,
  pageSize,
}) {
  const { packages, loading, error } =
    useTransactionPackageStore();

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
      render: (text) => `${currencyInfo?.symbol}${formatCurrency(text)}`,
    },
    {
      title: "Earned Points",
      dataIndex: "earnPoints",
      key: "earnPoints",
      render: (text) => `${currencyInfo?.symbol}${formatCurrency(text)}`,
    },
    {
      title: "Date",
      dataIndex: "dateCreated",
      key: "dateCreated",
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  const sortedPackages = packages
    ? [...packages]?.sort(
        (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
      )
    : [];

  const paginatedPackages = sortedPackages?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
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
  );
}

Transaction.propTypes = {
  getColumnSearchProps: PropTypes.func.isRequired,
  currencyInfo: PropTypes.object.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
};
