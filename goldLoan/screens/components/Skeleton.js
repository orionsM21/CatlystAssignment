import React from "react";
import { View, StyleSheet } from "react-native";

export default function Skeleton() {
  return (
    <View style={styles.container}>
      {/* Top cards */}
      <View style={styles.card} />
      <View style={styles.card} />

      {/* KPI row */}
      <View style={styles.row}>
        <View style={styles.kpi} />
        <View style={styles.kpi} />
        <View style={styles.kpi} />
      </View>

      {/* List placeholders */}
      {[1, 2, 3, 4].map(i => (
        <View key={i} style={styles.listItem} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  card: {
    height: 80,
    backgroundColor: "#EEE",
    borderRadius: 12,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },

  kpi: {
    height: 60,
    width: "30%",
    backgroundColor: "#EEE",
    borderRadius: 10,
  },

  listItem: {
    height: 70,
    backgroundColor: "#EEE",
    borderRadius: 12,
    marginBottom: 10,
  },
});