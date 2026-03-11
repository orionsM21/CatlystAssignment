import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const Header = ({
  userName = "Gold Loan User",
  initials = "MM",
  pipelines = 0,
  onMenuPress,
}) => {
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={onMenuPress}
          activeOpacity={0.85}
        >
          <Image
            source={require("../../asset/icon/menus.png")}
            style={styles.drawerIcon}
          />

          <View>
            <Text style={styles.headerSubTitle}>Welcome back,</Text>
            <Text style={styles.headerTitle}>{userName}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.avatarWrapper}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      </View>

      <View style={styles.headerSummaryRow}>
        <View>
          <Text style={styles.summaryLabel}>Today's Overview</Text>
          <Text style={styles.summaryValue}>{pipelines} Active Pipelines</Text>
        </View>

        <View style={styles.chip}>
          <Text style={styles.chipText}>Live</Text>
        </View>
      </View>
    </View>
  );
};

export default React.memo(Header);

const styles = StyleSheet.create({
  headerWrapper: {
    paddingTop: 48,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: "#1F3C88",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  drawerIcon: {
    width: 26,
    height: 26,
    marginRight: 12,
    tintColor: "#fff",
  },

  headerSubTitle: {
    color: "#DCE4FF",
    fontSize: 13,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  avatarWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#2196F3",
    fontWeight: "700",
    fontSize: 16,
  },

  headerSummaryRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  summaryLabel: {
    color: "#e5e5e5",
    fontSize: 13,
  },

  summaryValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },

  chip: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  chipText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});