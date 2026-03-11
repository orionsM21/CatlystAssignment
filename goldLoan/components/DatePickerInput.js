import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Image, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Ionicons";

const DatePickerInput = ({
    label,
    value,
    onChange,
    verified,
    businessDate
}) => {

    const [show, setShow] = useState(false);


    /* ---------- Business Date Conversion ---------- */

    const businessDateObj = useMemo(() => {

        if (!Array.isArray(businessDate) || businessDate.length !== 3)
            return null;

        const [y, m, d] = businessDate;

        return new Date(y, m - 1, d);

    }, [businessDate]);


    /* ---------- Selected Date Logic ---------- */

    const selectedDate = useMemo(() => {

        if (value) {
            const [y, m, d] = value.split("-").map(Number);
            return new Date(y, m - 1, d);
        }

        if (businessDateObj) return businessDateObj;

        return new Date();

    }, [value, businessDateObj]);


    /* ---------- Format for UI ---------- */

    const formatDate = (date) => {
        if (!date) return "";

        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");

        return `${y}-${m}-${d}`;
    };


    /* ---------- Handle Change ---------- */

    const handleChange = (_, selected) => {

        setShow(false);

        if (selected) {
            onChange(formatDate(selected));
        }

    };


    return (
        <View style={{ flex: 1 }}>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.label}>{label}</Text>

                {verified && (
                    <Icon
                        name="checkmark-circle"
                        size={16}
                        color="#22C55E"
                        style={{ marginLeft: 6 }}
                    />
                )}
            </View>


            {/* <TouchableOpacity
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: verified ? "#2ecc71" : "#ccc",
                    borderRadius: 6,
                    backgroundColor: "#fff",
                    paddingHorizontal: isSmallScreen ? 8 : 10,
                    height: isSmallScreen ? 36 : 45,
                }}
                onPress={() => setShow(true)}
                activeOpacity={0.7}
            > */}
            <TouchableOpacity
                style={[
                    styles.dateInputContainer,
                    verified && styles.dateVerifiedBorder
                ]}
                onPress={() => setShow(true)}
            >

                <Text style={value ? styles.dateText : styles.datePlaceholder}>
                    {formatDate(selectedDate) || `Select ${label}`}
                </Text>

                <Image
                    source={require("../asset/calendar.png")}
                    style={styles.calendarIcon}
                />

            </TouchableOpacity>


            {/* {show && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "calendar"}
                    onChange={handleChange}
                    maximumDate={new Date()}
                />
            )} */}
            {show && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "calendar"}
                    onChange={handleChange}

                    maximumDate={
                        businessDateObj ? businessDateObj : new Date()
                    }
                />
            )}

        </View>
    );
};

export default DatePickerInput;

const styles = StyleSheet.create({

    /* Label */

    label: {
        fontSize: 13,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 4
    },

    required: {
        color: "#EF4444"
    },



    /* Date Picker Container */

    dateInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,

        backgroundColor: "#fff",

        paddingHorizontal: 10,
        height: 44
    },



    /* Date Text */

    dateText: {
        flex: 1,
        fontSize: 14,
        color: "#111827"
    },



    /* Placeholder */

    datePlaceholder: {
        flex: 1,
        fontSize: 14,
        color: "#9CA3AF"
    },



    /* Verified Border */

    dateVerifiedBorder: {
        borderColor: "#22C55E"
    },



    /* Calendar Icon */

    calendarIcon: {
        width: 20,
        height: 20,
        tintColor: "#6B7280"
    }

});