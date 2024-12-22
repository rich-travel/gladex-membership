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
