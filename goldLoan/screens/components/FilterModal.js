// import React, { useState, useRef, useEffect } from "react";
// import {
//     View,
//     Text,
//     Modal,
//     StyleSheet,
//     TouchableOpacity,
//     Pressable,
//     Animated,
//     Platform,
//     useColorScheme
// } from "react-native";

// import { Dropdown } from "react-native-element-dropdown";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { moderateScale, verticalScale, scale } from "react-native-size-matters";

// const DEFAULT_FILTERS = {
//     status: "ALL",
//     itemType: "ALL",
//     itemCategory: "ALL",
//     scheme: "ALL",
//     repayment: "ALL",
//     fromDate: null,
//     toDate: null,
//     minAmount: null,
//     maxAmount: null
// };

// const ITEM_TYPES = [
//     { label: "All", value: "ALL" },
//     { label: "Gold Necklace", value: "Gold Necklace" },
//     { label: "Gold Ring", value: "Gold Ring" },
//     { label: "Gold Chain", value: "Gold Chain" }
// ];

// const SCHEMES = [
//     { label: "All", value: "ALL" },
//     { label: "Regular Gold Loan", value: "Regular Gold Loan" },
//     { label: "Express Gold Loan", value: "Express Gold Loan" }
// ];

// const REPAYMENT_TYPES = [
//     { label: "All", value: "ALL" },
//     { label: "Monthly EMI", value: "Monthly EMI" },
//     { label: "Bullet", value: "Bullet" }
// ];

// const FilterModal = ({ filters, onApply, onClose, panResponder, panY }) => {
//     const colorScheme = useColorScheme();
//     const isDark = colorScheme === 'dark';


//     const colors = {
//         text: isDark ? '#F3F3F3' : '#000',
//         placeholder: isDark ? '#333' : '#888',
//         border: isDark ? '#666' : '#CCC',
//         background: isDark ? '#1C1C1C' : '#FFF',
//         dropdownItemBg: isDark ? '#2C2C2C' : '#FFF',
//         disabledBg: isDark ? '#2A2A2A' : '#F3F3F3',
//         searchTextColor: isDark ? '#FFF' : '#000',
//         searchBg: isDark ? '#1C1C1C' : '#FFF',
//     };
//     const [local, setLocal] = useState(filters);
//     const [showDatePicker, setShowDatePicker] = useState(null);

//     useEffect(() => {
//         setLocal(filters);
//     }, [filters]);

//     const update = (key, value) => {
//         setLocal(prev => ({ ...prev, [key]: value }));
//     };

//     const clearAll = () => {
//         setLocal(DEFAULT_FILTERS);
//         onApply(DEFAULT_FILTERS);
//     };

//     return (
//         <Modal transparent animationType="fade">

//             <View style={styles.modalOverlay}>

//                 <Pressable
//                     style={StyleSheet.absoluteFill}
//                     onPress={onClose}
//                 />

//                 <Animated.View
//                     {...panResponder.panHandlers}
//                     style={[styles.modalCard, { transform: [{ translateY: panY }] }]}
//                 >

//                     <Text style={styles.modalTitle}>Filters</Text>



//                     <Text style={styles.filterLabel}>Item Type</Text>


//                     <Dropdown
//                         style={styles.dropdown}
//                         placeholderStyle={styles.placeholderStyle}
//                         selectedTextStyle={styles.selectedTextStyle}
//                         itemTextStyle={styles.itemTextStyle}
//                         data={ITEM_TYPES}
//                         labelField="label"
//                         valueField="value"
//                         value={local.itemType}
//                         placeholder="Select Item Type"
//                         onChange={item => update("itemType", item.value)}
//                         renderItem={(item) => (
//                             <View style={[styles.dropdownItem, { backgroundColor: colors.dropdownItemBg }]}>
//                                 <Text style={[styles.dropdownItemText, { color: colors.text }]}>{item.label}</Text>
//                             </View>
//                         )}
//                     />
//                     {/* Scheme */}

//                     <Text style={styles.filterLabel}>Scheme</Text>

//                     <Dropdown
//                         style={styles.dropdown}
//                         placeholderStyle={styles.placeholderStyle}
//                         selectedTextStyle={styles.selectedTextStyle}
//                         itemTextStyle={styles.itemTextStyle}
//                         data={SCHEMES}
//                         labelField="label"
//                         valueField="value"
//                         value={local.scheme}
//                         placeholder="Select Item Type"
//                         onChange={item => update("scheme", item.value)}
//                         renderItem={(item) => (
//                             <View style={[styles.dropdownItem, { backgroundColor: colors.dropdownItemBg }]}>
//                                 <Text style={[styles.dropdownItemText, { color: colors.text }]}>{item.label}</Text>
//                             </View>
//                         )}
//                     />
//                     {/* Repayment */}

//                     <Text style={styles.filterLabel}>Repayment Type</Text>


//                     <Dropdown
//                         style={styles.dropdown}
//                         placeholderStyle={styles.placeholderStyle}
//                         selectedTextStyle={styles.selectedTextStyle}
//                         itemTextStyle={styles.itemTextStyle}
//                         data={REPAYMENT_TYPES}
//                         labelField="label"
//                         valueField="value"
//                         value={local.repayment}
//                         placeholder="Select Item Type"
//                         onChange={item => update("repayment", item.value)}
//                         renderItem={(item) => (
//                             <View style={[styles.dropdownItem, { backgroundColor: colors.dropdownItemBg }]}>
//                                 <Text style={[styles.dropdownItemText, { color: colors.text }]}>{item.label}</Text>
//                             </View>
//                         )}
//                     />

//                     {/* Date Range */}

//                     <Text style={styles.filterLabel}>Date Range</Text>

//                     <View style={styles.dateRow}>

//                         <TouchableOpacity
//                             style={styles.dateBtn}
//                             onPress={() => setShowDatePicker("from")}
//                         >
//                             <Text style={styles.dateText}>
//                                 {local.fromDate ? local.fromDate.toDateString() : "From Date"}
//                             </Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             style={styles.dateBtn}
//                             onPress={() => setShowDatePicker("to")}
//                         >
//                             <Text style={styles.dateText}>
//                                 {local.toDate ? local.toDate.toDateString() : "To Date"}
//                             </Text>
//                         </TouchableOpacity>

//                     </View>

//                     {showDatePicker && (
//                         <DateTimePicker
//                             value={
//                                 showDatePicker === "from"
//                                     ? local.fromDate || new Date()
//                                     : local.toDate || new Date()
//                             }
//                             mode="date"
//                             display={Platform.OS === "ios" ? "spinner" : "default"}
//                             onChange={(_, selectedDate) => {

//                                 if (selectedDate) {
//                                     update(
//                                         showDatePicker === "from" ? "fromDate" : "toDate",
//                                         selectedDate
//                                     );
//                                 }

//                                 setShowDatePicker(null);
//                             }}
//                         />
//                     )}

//                     {/* Actions */}

//                     <View style={styles.modalActions}>

//                         <TouchableOpacity onPress={onClose}>
//                             <Text style={styles.cancelText}>Cancel</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity onPress={clearAll}>
//                             <Text style={styles.resetText}>Clear All</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             style={styles.applyBtn}
//                             onPress={() => onApply(local)}
//                         >
//                             <Text style={styles.applyText}>Apply Filters</Text>
//                         </TouchableOpacity>

//                     </View>

//                 </Animated.View>

//             </View>

//         </Modal>
//     );
// };

// export default FilterModal;

// const styles = StyleSheet.create({

//     modalOverlay: {
//         flex: 1,
//         justifyContent: "flex-end",
//         backgroundColor: "rgba(0,0,0,0.35)"
//     },

//     modalCard: {
//         backgroundColor: "#FFF",
//         borderTopLeftRadius: 24,
//         borderTopRightRadius: 24,
//         padding: 20,
//         maxHeight: "85%"
//     },

//     modalTitle: {
//         fontSize: 18,
//         fontWeight: "700",
//         marginBottom: 16
//     },

//     filterLabel: {
//         fontSize: 12,
//         marginTop: 12,
//         marginBottom: 6,
//         color: "#666"
//     },

//     dropdown: {
//         height: 48,
//         borderWidth: 1,
//         borderColor: "#EEE",
//         borderRadius: 10,
//         paddingHorizontal: 12,
//         justifyContent: "center",
//         color: '#111'
//     },

//     placeholderStyle: {
//         fontSize: 14,
//         color: "#999"
//     },

//     selectedTextStyle: {
//         fontSize: 14,
//         color: "#111"
//     },

//     itemTextStyle: {
//         fontSize: 14
//     },

//     dateRow: {
//         flexDirection: "row",
//         gap: 8,
//         marginTop: 6
//     },

//     dateBtn: {
//         flex: 1,
//         borderWidth: 1,
//         borderColor: "#EEE",
//         padding: 12,
//         borderRadius: 10
//     },

//     dateText: {
//         fontSize: 13,
//         color: "#333"
//     },

//     modalActions: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginTop: 24,
//         alignItems: "center"
//     },

//     cancelText: {
//         color: "#999"
//     },

//     resetText: {
//         color: "#C9A23F",
//         fontWeight: "600"
//     },

//     applyBtn: {
//         backgroundColor: "#C9A23F",
//         paddingHorizontal: 18,
//         paddingVertical: 10,
//         borderRadius: 10
//     },

//     applyText: {
//         color: "#FFF",
//         fontWeight: "700"
//     },
//     dropdownItem: {
//         paddingVertical: verticalScale(8),
//         paddingHorizontal: scale(10),
//     },

//     // 🔹 Dropdown item text (inside item)
//     dropdownItemText: {
//         fontSize: moderateScale(13),
//         color: '#333',
//     },
// });

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    Animated,
    Platform,
    useColorScheme
} from "react-native";

import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const DEFAULT_FILTERS = {
    status: "ALL",
    itemType: "ALL",
    itemCategory: "ALL",
    scheme: "ALL",
    repayment: "ALL",
    fromDate: null,
    toDate: null
};

const FilterModal = ({
    filters,
    onApply,
    onClose,
    panResponder,
    panY,
    itemTypes = [],
    schemes = [],
    repayments = []
}) => {

    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const colors = {
        background: isDark ? "#1C1C1C" : "#FFF",
        text: isDark ? "#FFF" : "#111",
        border: isDark ? "#444" : "#EEE",
        placeholder: isDark ? "#888" : "#999",
    };

    const [local, setLocal] = useState(filters);
    const [showDatePicker, setShowDatePicker] = useState(null);

    useEffect(() => {
        setLocal(filters);
    }, [filters]);

    const update = (key, value) => {
        setLocal(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearAll = () => {
        setLocal(DEFAULT_FILTERS);
        onApply(DEFAULT_FILTERS);
    };

    return (
        <Modal transparent animationType="fade">

            <View style={styles.modalOverlay}>

                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={onClose}
                />

                <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                        styles.modalCard,
                        { backgroundColor: colors.background },
                        { transform: [{ translateY: panY }] }
                    ]}
                >

                    <Text style={[styles.modalTitle, { color: colors.text }]}>
                        Filters
                    </Text>

                    {/* ITEM TYPE */}

                    <Text style={styles.filterLabel}>Item Type</Text>

                    <Dropdown
                        style={[styles.dropdown, { borderColor: colors.border }]}
                        data={itemTypes}
                        labelField="label"
                        valueField="value"
                        value={local.itemType}
                        placeholder="Select Item Type"
                        placeholderStyle={{ color: colors.placeholder }}
                        selectedTextStyle={{ color: colors.text }}
                        onChange={item => update("itemType", item.value)}
                        renderItem={(item) => (
                            <View style={[styles.dropdownItem, { backgroundColor: colors.dropdownItemBg }]}>
                                <Text style={[styles.dropdownItemText, { color: colors.text }]}>{item.label}</Text>
                            </View>
                        )}
                    />

                    {/* SCHEME */}

                    <Text style={styles.filterLabel}>Scheme</Text>

                    <Dropdown
                        style={[styles.dropdown, { borderColor: colors.border }]}
                        data={schemes}
                        labelField="label"
                        valueField="value"
                        value={local.scheme}
                        placeholder="Select Scheme"
                        placeholderStyle={{ color: colors.placeholder }}
                        selectedTextStyle={{ color: colors.text }}
                        onChange={item => update("scheme", item.value)}
                        renderItem={(item) => (
                            <View style={[styles.dropdownItem, { backgroundColor: colors.dropdownItemBg }]}>
                                <Text style={[styles.dropdownItemText, { color: colors.text }]}>{item.label}</Text>
                            </View>
                        )}
                    />

                    {/* REPAYMENT */}

                    <Text style={styles.filterLabel}>Repayment Type</Text>

                    <Dropdown
                        style={[styles.dropdown, { borderColor: colors.border }]}
                        data={repayments}
                        labelField="label"
                        valueField="value"
                        value={local.repayment}
                        placeholder="Select Repayment"
                        placeholderStyle={{ color: colors.placeholder }}
                        selectedTextStyle={{ color: colors.text }}
                        onChange={item => update("repayment", item.value)}
                        renderItem={(item) => (
                            <View style={[styles.dropdownItem, { backgroundColor: colors.dropdownItemBg }]}>
                                <Text style={[styles.dropdownItemText, { color: colors.text }]}>{item.label}</Text>
                            </View>
                        )}
                    />

                    {/* DATE RANGE */}

                    <Text style={styles.filterLabel}>Date Range</Text>

                    <View style={styles.dateRow}>

                        <TouchableOpacity
                            style={[styles.dateBtn, { borderColor: colors.border }]}
                            onPress={() => setShowDatePicker("from")}
                        >
                            <Text style={{ color: colors.text }}>
                                {local.fromDate
                                    ? new Date(local.fromDate).toDateString()
                                    : "From Date"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.dateBtn, { borderColor: colors.border }]}
                            onPress={() => setShowDatePicker("to")}
                        >
                            <Text style={{ color: colors.text }}>
                                {local.toDate
                                    ? new Date(local.toDate).toDateString()
                                    : "To Date"}
                            </Text>
                        </TouchableOpacity>

                    </View>

                    {showDatePicker && (

                        <DateTimePicker
                            value={
                                showDatePicker === "from"
                                    ? new Date(local.fromDate || Date.now())
                                    : new Date(local.toDate || Date.now())
                            }
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={(e, date) => {

                                if (date) {

                                    update(
                                        showDatePicker === "from"
                                            ? "fromDate"
                                            : "toDate",
                                        date.getTime()
                                    );

                                }

                                setShowDatePicker(null);

                            }}
                        />

                    )}

                    {/* ACTIONS */}

                    <View style={styles.modalActions}>

                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={clearAll}>
                            <Text style={styles.resetText}>Clear All</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.applyBtn}
                            onPress={() => onApply(local)}
                        >
                            <Text style={styles.applyText}>
                                Apply Filters
                            </Text>
                        </TouchableOpacity>

                    </View>

                </Animated.View>

            </View>

        </Modal>
    );

};

export default FilterModal;

const styles = StyleSheet.create({

    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.35)"
    },

    modalCard: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: "85%"
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16
    },

    filterLabel: {
        fontSize: 12,
        marginTop: 12,
        marginBottom: 6,
        color: "#666"
    },

    dropdown: {
        height: 48,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        justifyContent: "center"
    },

    dateRow: {
        flexDirection: "row",
        gap: 8,
        marginTop: 6
    },

    dateBtn: {
        flex: 1,
        borderWidth: 1,
        padding: 12,
        borderRadius: 10
    },

    modalActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
        alignItems: "center"
    },

    cancelText: {
        color: "#999"
    },

    resetText: {
        color: "#C9A23F",
        fontWeight: "600"
    },

    applyBtn: {
        backgroundColor: "#C9A23F",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 10
    },

    applyText: {
        color: "#FFF",
        fontWeight: "700"
    },
    dropdownItem: {
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(10),
    },

    // 🔹 Dropdown item text (inside item)
    dropdownItemText: {
        fontSize: moderateScale(13),
        color: '#333',
    },
});