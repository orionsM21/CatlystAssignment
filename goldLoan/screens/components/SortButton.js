import React, { useCallback } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

function SortButton({ sortBy, onChange }) {
  const handlePress = useCallback(() => {
    const next = sortBy === "LATEST" ? "AMOUNT" : "LATEST";
    onChange(next);
  }, [sortBy, onChange]);

  const label = sortBy === "LATEST" ? "Latest" : "Amount";

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <Text style={styles.text}>Sort: {label}</Text>
    </TouchableOpacity>
  );
}

export default React.memo(SortButton);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(16),
    elevation: 2,
    alignSelf: "flex-start",
    marginBottom: verticalScale(14),
  },

  text: {
    fontSize: moderateScale(12),
    fontWeight: "600",
    color: "#333",
  },
});