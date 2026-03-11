import React from "react";
import KycReport from "./report/KycReport";
import GoldValuationReport from "./report/GoldValuationReport";
import LoanSanctionReport from "./report/LoanSanctionReport";



/*
  Registry Pattern
*/

const REPORT_COMPONENT_MAP = {
  2: KycReport,
  3: GoldValuationReport,
  4: LoanSanctionReport,
};

const DynamicReportRenderer = ({ type, data }) => {
  const Component = REPORT_COMPONENT_MAP[type];

  if (!Component) return null;

  return <Component data={data} />;
};

export default DynamicReportRenderer;
