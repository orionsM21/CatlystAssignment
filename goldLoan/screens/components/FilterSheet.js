import React, { useCallback } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { DEFAULT_FILTERS } from "../Dashboard/constants";

function FilterSheet({ onApply }) {
  const handleClear = useCallback(() => {
    onApply({ ...DEFAULT_FILTERS });
  }, [onApply]);

  return (
    <View >
      <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
        <Text style={styles.clearText}>Clear Filters</Text>
      </TouchableOpacity>
    </View>
  );
}

export default React.memo(FilterSheet);

const styles = StyleSheet.create({
  // container: {
  //   marginTop: 20,
  //   alignItems: "center",
  //   paddingHorizontal: 16,
  // },
  // container: {
  //   position: "absolute",
  //   bottom: 20,
  //   right: 20,
  // },
  filterButton: {
    backgroundColor: "#111",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    alignSelf: "flex-start",
  },

  filterButtonText: {
    color: "#FFD700",
    fontWeight: "600",
    fontSize: 12,
  },
  clearBtn: {
    backgroundColor: "#111",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    alignSelf: "flex-start",
  },

  clearText: {
    color: "#FFD700",
    fontWeight: "600",
    fontSize: 12,
  },
});