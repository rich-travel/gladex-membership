import { message } from "antd";

export function formatCurrency(amount) {
  if (isNaN(amount)) {
    return "0.00";
  }
  return Number(amount)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

export function getCurrencyInfo() {
  return {
    symbol: "₱",
    code: "PHP",
  };
}

export function maskMembershipId(membershipId) {
  if (!membershipId) return "";
  const visibleDigits = membershipId.slice(-4);
  const maskedDigits = membershipId.slice(0, -4).replace(/./g, "*");
  return `${maskedDigits} ${visibleDigits}`;
}

export const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      message.success("Membership ID copied to clipboard");
    })
    .catch((err) => {
      message.error("Failed to copy Membership ID", err);
    });
};
