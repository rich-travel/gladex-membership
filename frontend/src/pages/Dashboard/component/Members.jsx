import { Empty, Pagination, Table } from "antd";
import PropTypes from "prop-types";
import useAuthStore from "../../../stores/authStore";
export default function Members({
  handlePageChange,
  currentPage,
  pageSize,
  memberColumns,
}) {
  const { allMemberUsers } = useAuthStore();

  const sortedMemberUsers = allMemberUsers
    ? [...allMemberUsers]?.sort(
        (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
      )
    : [];

  const paginatedMemberUsers = sortedMemberUsers?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <h2 className="text-center text-lg md:text-2xl font-bold my-4">
        All Member Users
      </h2>
      {allMemberUsers?.length > 0 ? (
        <>
          <div className="table-responsive">
            <Table
              dataSource={paginatedMemberUsers}
              columns={memberColumns}
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
  );
}

Members.propTypes = {
  handlePageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  memberColumns: PropTypes.array.isRequired,
};