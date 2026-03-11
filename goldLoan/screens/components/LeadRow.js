import React from "react";
import { View, Text, StyleSheet } from "react-native";

function LeadRow({ item = {} }) {
  const { name, amount, status } = item;

  const statusColor =
    status === "Approved"
      ? "#2E7D32"
      : status === "Pending"
        ? "#ED6C02"
        : "#D32F2F";

  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.amount}>₹{amount}L</Text>
      </View>

      <Text style={[styles.status, { color: statusColor }]}>
        {status}
      </Text>
    </View>
  );
}

export default React.memo(LeadRow);

const styles = StyleSheet.create({
  row: {
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },

  amount: {
    marginTop: 4,
    fontSize: 13,
    color: "#777",
  },

  status: {
    fontSize: 13,
    fontWeight: "700",
  },
});