import React, { useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { DEFAULT_FILTERS, FILTER_LABELS } from "../Dashboard/constants";

function AppliedFilters({ filters, onRemove }) {
    const activeFilters = useMemo(() => {
        return Object.entries(filters || {}).filter(
            ([_, value]) => value !== "ALL" && value !== null
        );
    }, [filters]);

    const handleRemove = useCallback(
        (key) => {
            onRemove(key);   // ← JUST PASS KEY
        },
        [onRemove]
    );

    if (!activeFilters.length) return null;

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.row}>
                {activeFilters.map(([key, value]) => {
                    const display =
                        value instanceof Date
                            ? value.toDateString()
                            : key === "minAmount" || key === "maxAmount"
                                ? `₹${value}L`
                                : value;

                    return (
                        <TouchableOpacity
                            key={key}
                            style={styles.tag}
                            onPress={() => handleRemove(key)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.text}>
                                {FILTER_LABELS[key]}: {display} ✕
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
}

export default React.memo(AppliedFilters);

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: verticalScale(12),
    },

    tag: {
        backgroundColor: "#F4EBD0",
        paddingHorizontal: moderateScale(14),
        paddingVertical: verticalScale(6),
        borderRadius: moderateScale(18),
        marginRight: moderateScale(8),
    },

    text: {
        color: "#C9A23F",
        fontSize: moderateScale(12),
        fontWeight: "600",
    },
});