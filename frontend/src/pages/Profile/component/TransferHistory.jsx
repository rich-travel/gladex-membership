import { useEffect } from "react";
import useAuthStore from "../../../stores/authStore";
import useTransferPointsStore from "../../../stores/transferPointsStore";
import { formatCurrency, getCurrencyInfo } from "../../../utils/GeneralHelper";

export default function TransferHistory() {
  const { transferHistory, fetchTransferHistory } = useTransferPointsStore();
  const { userInfo } = useAuthStore();
  const currencyInfo = getCurrencyInfo();

  useEffect(() => {
    if (userInfo?.membershipId) {
      fetchTransferHistory(userInfo?.membershipId);
    }
  }, [userInfo, fetchTransferHistory]);

  const sortedTransferHistory = transferHistory
    ? [...transferHistory]?.sort(
        (a, b) => new Date(b.dateTransferred) - new Date(a.dateTransferred)
      )
    : [];

  return (
    <>
      <div className="section__container-2">
        <div className="points-wrapper">
          {sortedTransferHistory?.map((item, index) => {
            const totalPoints = item?.pointsTransferred + item?.transferFee;
            const isReceived = item?.toMembershipId === userInfo?.membershipId;
            return (
              <div key={index} className="points-card">
                <div className="flex justify-between">
                  <span>{isReceived ? "From:" : "To:"}</span>
                  <span className="capitalize">
                    {isReceived ? item?.fromFullName : item?.toFullName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Fee:</span>
                  <span className="text-red-500 font-semibold">
                    -{currencyInfo.symbol}
                    {formatCurrency(item?.transferFee)}
                  </span>
                </div>
                <div className="flex justify-between border-b-2 border-gray-500 pb-2">
                  <span>Amount:</span>
                  <span
                    className={
                      isReceived
                        ? "text-green-600 font-semibold"
                        : "text-red-500 font-semibold"
                    }
                  >
                    {isReceived ? "+" : "-"}
                    {currencyInfo.symbol}
                    {formatCurrency(item?.pointsTransferred)}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>{isReceived ? "Received" : "Deducted"}:</span>
                  <span
                    className={
                      isReceived
                        ? "text-green-600 font-semibold"
                        : "text-red-500 font-semibold"
                    }
                  >
                    {isReceived ? "+" : "-"}
                    {currencyInfo.symbol}
                    {isReceived ? item?.pointsTransferred : totalPoints}
                  </span>
                </div>
                <div className="text-gray-500 text-xs mt-2">
                  {new Date(item?.dateTransferred).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
