import React from "react";
import { View, Text, StyleSheet } from "react-native";

const COLORS = {
  card: "#FFFFFF",
  gold: "#C9A23F",
  textSecondary: "#6B7280",
};

export default React.memo(function TotalDisbursed({ amount = 0 }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Total Disbursed</Text>
      <Text style={styles.value}>₹ {amount} L</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 20,
    // marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gold,
    marginHorizontal: 9
  },

  label: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  value: {
    color: COLORS.gold,
    fontSize: 28,
    fontWeight: "800",
  },
});