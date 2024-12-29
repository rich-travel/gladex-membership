import { Empty, Pagination, Table } from "antd";
import PropTypes from "prop-types";
import useAuthStore from "../../../stores/authStore";

export default function Admins({
  handlePageChange,
  currentPage,
  pageSize,
  memberColumns,
}) {
  const { allAdminUsers } = useAuthStore();

  const sortedAdminUsers = allAdminUsers
    ? [...allAdminUsers]?.sort(
        (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
      )
    : [];

  const paginatedAdminUsers = sortedAdminUsers?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <h2 className="text-center text-lg md:text-2xl font-bold my-4">
        All Admin Users
      </h2>
      {allAdminUsers?.length > 0 ? (
        <>
          <div className="table-responsive">
            <Table
              dataSource={paginatedAdminUsers}
              columns={memberColumns}
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
  );
}

Admins.propTypes = {
  handlePageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  memberColumns: PropTypes.array.isRequired,
};
