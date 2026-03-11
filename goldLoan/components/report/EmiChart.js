import React, { useMemo } from "react";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width - 24;

export default function EmiChart({ data }) {

  const chartData = useMemo(() => ({
    labels: data.map((_, i) => `${i+1}`),
    datasets: [
      {
        data: data.map(r => Number(r.closingBalance || 0))
      }
    ]
  }), [data]);

  return (
    <LineChart
      data={chartData}
      width={screenWidth}
      height={220}
      bezier
      chartConfig={{
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 0,
        color: () => "#2563EB",
        labelColor: () => "#64748B",
      }}
      style={{ marginVertical: 12 }}
    />
  );
}
