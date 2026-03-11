import React, { useCallback } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const TABS = ["ALL", "Approved", "Pending", "Rejected"];

function StatusTabs({ value, onChange }) {
  console.log(onChange, value, 'onChangeonChange')
  const handlePress = useCallback(
    (tab) => {
      onChange(tab);     // NOTHING ELSE
    },
    [onChange]
  );

  return (
    <View style={styles.container}>
      {TABS.map(tab => {
        const active = value === tab;

        return (
          <TouchableOpacity
            key={tab}
            onPress={() => handlePress(tab)}
            activeOpacity={0.7}
            style={[styles.tab, active && styles.activeTab]}
          >
            <Text style={[styles.text, active && styles.activeText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default React.memo(StatusTabs);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 12,
  },

  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#EEE",
    marginRight: 10,
  },

  activeTab: {
    backgroundColor: "#C9A23F",
  },

  text: {
    fontSize: 13,
    color: "#444",
  },

  activeText: {
    color: "#FFF",
    fontWeight: "700",
  },
});