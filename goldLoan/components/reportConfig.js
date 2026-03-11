export const REPORT_CONFIG = {
  3: { // Gold Valuation
    title: "Gold Valuation Report",

    header: [
      { label: "Application No", key: "applicationNo" },
      { label: "Customer Name", key: "customerName" },
      { label: "PAN", key: "pan" },
    ],

    table: {
      key: "goldItems",
      columns: [
        { label: "Item", key: "itemName" },
        { label: "Gross Wt", key: "grossWeight" },
        { label: "Net Wt", key: "netWeight" },
        { label: "Purity", key: "purity" },
        { label: "Rate", key: "rate" },
      ],
    },

    footer: [
      { label: "Total Value", key: "totalGoldValue" },
    ],
  },

  2: { title: "KYC Report" },
  4: { title: "Loan Sanction Report" },
  5: { title: "Disbursal Report" },
};
