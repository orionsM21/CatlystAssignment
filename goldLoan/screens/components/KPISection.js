import React from "react";
import { View, Text, StyleSheet } from "react-native";

function KPISection({ kpis = {} }) {
  return (
    <View style={styles.container}>
      <KPICard label="Total" value={kpis.total} />
      <KPICard label="Approved" value={kpis.approved} />
      <KPICard label="Pending" value={kpis.pending} />
    </View>
  );
}

const KPICard = React.memo(({ label, value }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value ?? 0}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
});

export default React.memo(KPISection);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },

  card: {
    flex: 1,
    backgroundColor: "#FFF",
    marginHorizontal: 6,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  value: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  label: {
    marginTop: 4,
    fontSize: 12,
    color: "#777",
  },
});