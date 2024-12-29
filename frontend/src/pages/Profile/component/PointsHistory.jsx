import { useEffect } from "react";
import useAuthStore from "../../../stores/authStore";
import useTransactionPackageStore from "../../../stores/transactionPackageStore";
import { formatCurrency, getCurrencyInfo } from "../../../utils/GeneralHelper";
import DashboardLayout from "../../../components/DashboardLayout";

export default function PointsHistory() {
  const { userInfo } = useAuthStore();
  const { userPackages, fetchUserPackages } = useTransactionPackageStore();
  const currencyInfo = getCurrencyInfo();

  useEffect(() => {
    if (userInfo?.membershipId) {
      fetchUserPackages(userInfo?.membershipId);
    }
  }, [userInfo, fetchUserPackages]);

  const sortedUserPackages = userPackages
    ? [...userPackages]?.sort(
        (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
      )
    : [];
  return (
    <>
      <DashboardLayout title="Points History" />
      <div className="section__container-2">
        <div className="points-wrapper">
          {sortedUserPackages?.map((item, index) => (
            <div key={index} className="points-card">
              <div>{item?.packageAvailed}</div>
              <div className="flex justify-between">
                <span>
                  {currencyInfo.symbol}
                  {formatCurrency(item?.packagePrice)}
                </span>
                <span className="text-green-600 font-semibold">
                  +{currencyInfo.symbol}
                  {formatCurrency(item?.earnPoints)}
                </span>
              </div>
              <div className="text-gray-500 text-xs mt-2">
                {new Date(item?.dateCreated).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
