import { useEffect } from "react";
import useMembershipLevelStore from "../../stores/membershipLevelStore";

export default function MembershipCard() {
  const { membershipLevels, fetchAllMembershipLevels, loading, error } =
    useMembershipLevelStore();

  useEffect(() => {
    fetchAllMembershipLevels();
  }, [fetchAllMembershipLevels]);

  return (
    <>
      <h1 className="text-center text-xl md:text-3xl font-bold">
        Membership Card
      </h1>
      <div className="section__container-2">
        {loading && <p>Loading membership levels...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && membershipLevels?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {membershipLevels.map((level) => (
              <div
                key={level._id}
                className="bg-white shadow-md rounded-lg p-4"
              >
                <h2 className="text-lg font-bold mb-2">
                  {level.membershipName}
                </h2>
                <p className="text-sm mb-1">
                  <strong>Level:</strong> {level?.membershipLevel}
                </p>
                <p className="text-sm mb-1">
                  <strong>Requirements:</strong> {level?.requirementsAmount}
                </p>
                <p className="text-sm mb-1">
                  <strong>Benefits:</strong>
                  <div
                    dangerouslySetInnerHTML={{ __html: level?.benefits }}
                  />
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Date Created:</strong>{" "}
                  {new Date(level?.dateCreated).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No membership levels found.</p>
        )}
      </div>
    </>
  );
}