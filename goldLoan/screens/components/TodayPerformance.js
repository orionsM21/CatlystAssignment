import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

export default React.memo(function TodayPerformance({ leads = 0, disbursed = 0 }) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>Today’s Leads</Text>
        <Text style={styles.value}>{leads}</Text>
      </View>

      <View>
        <Text style={styles.label}>Today’s Disbursed</Text>
        <Text style={styles.amount}>₹{disbursed}L</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: moderateScale(14),
    padding: moderateScale(16),
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(14),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    margin: 9
  },

  label: {
    fontSize: moderateScale(12),
    color: "#777",
  },

  value: {
    fontSize: moderateScale(22),
    fontWeight: "700",
    color: "#333",
  },

  amount: {
    fontSize: moderateScale(22),
    fontWeight: "800",
    color: "#C9A23F",
  },
});