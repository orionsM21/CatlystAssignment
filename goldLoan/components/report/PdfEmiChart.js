import React, { useRef, useEffect } from "react";
import { View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import ViewShot from "react-native-view-shot";

export default function PdfEmiChart({ data, onCapture }) {
  const ref = useRef();

  useEffect(() => {
    setTimeout(async () => {
      const uri = await ref.current.capture();
      onCapture(uri);
    }, 400);
  }, []);

  const chartData = {
    labels: data.map((_, i) => `${i + 1}`),
    datasets: [
      {
        data: data.map(r => Number(r.closingBalance || 0))
      }
    ]
  };

  return (
    <ViewShot ref={ref} options={{ format: "png", quality: 1 }}>
      <LineChart
        data={chartData}
        width={320}
        height={200}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: () => "#2563EB",
        }}
      />
    </ViewShot>
  );
}
