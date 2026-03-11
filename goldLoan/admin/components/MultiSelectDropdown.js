import React, { useState, memo, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    FlatList, Modal
} from 'react-native';
import {
    moderateScale,
    verticalScale,
    scale,
} from 'react-native-size-matters';

const MultiSelectDropdown = ({
    label,
    data,
    value,
    onChange,
    labelField,
    valueField,
    span = 1,
    onHeightChange,
}) => {

    const [open, setOpen] = useState(false);

    /* ================= SELECTED ITEMS ================= */
    const selectedItems = useMemo(() => {
        return data.filter(item => value.includes(item[valueField]));
    }, [data, value, valueField]);
    const [inputHeight, setInputHeight] = useState(verticalScale(44));

    /* ================= TOGGLE ITEM ================= */
    const toggleItem = useCallback(
        item => {
            if (item?.disabled) return;

            const id = item[valueField];
            const exists = value.includes(id);

            onChange(exists ? value.filter(v => v !== id) : [...value, id]);
        },
        [value, onChange, valueField],
    );

    /* ================= REMOVE CHIP ================= */
    const removeItem = useCallback(
        id => {
            onChange(value.filter(v => v !== id));
        },
        [value, onChange],
    );

    return (
        <View
            style={[styles.container]}
            span={span}   // 🔥 THIS IS THE KEY
        >
            {label && <Text style={styles.label}>{label}</Text>}

            {/* ================= INPUT ================= */}
            <TouchableOpacity
                style={styles.input}
                onLayout={e => {
                    const h = e.nativeEvent.layout.height;
                    setInputHeight(h);
                    onHeightChange?.(h);
                }}

                activeOpacity={0.8}
                onPress={() => setOpen(o => !o)}
            >

                {value.length === 0 && (
                    <Text style={styles.placeholder}>Select</Text>
                )}

                {/* ================= CHIPS ================= */}
                <View style={styles.chipsWrap}>
                    {selectedItems.map(item => (
                        <View key={item[valueField]} style={styles.chip}>
                            <Text style={styles.chipText}>
                                {item[labelField]}
                            </Text>

                            <TouchableOpacity
                                hitSlop={8}
                                onPress={() => removeItem(item[valueField])}
                            >
                                <Text style={styles.remove}>×</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </TouchableOpacity>

            {/* ================= DROPDOWN OVERLAY ================= */}
            {open && (
                <>
                    {/* Outside click */}
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={() => setOpen(false)}
                    />

                    <View
                        style={[
                            styles.dropdown,
                            { top: inputHeight + verticalScale(8) }, // 🔥 DYNAMIC
                        ]}
                    >

                        <FlatList
                            data={data}
                            keyExtractor={item => String(item[valueField])}
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => {
                                const selected = value.includes(item[valueField]);

                                return (
                                    <TouchableOpacity
                                        disabled={item?.disabled}
                                        onPress={() => toggleItem(item)}
                                        style={[
                                            styles.item,
                                            selected && styles.selectedItem,
                                            item?.disabled && styles.disabledItem,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.itemText,
                                                item?.disabled && styles.disabledText,
                                            ]}
                                        >
                                            {item[labelField]}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </>
            )}
        </View>
    );
};

export default memo(MultiSelectDropdown);


const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginBottom: verticalScale(12),
    },

    full: {
        width: '100%',
    },

    label: {
        fontSize: moderateScale(12),
        fontWeight: '700',
        marginBottom: verticalScale(4),
        color: '#475569',
    },

    /* ===== INPUT ===== */
    input: {
        minHeight: verticalScale(44),
        maxHeight: verticalScale(96), // 🔥 dynamic growth
        borderRadius: moderateScale(10),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(6),
        backgroundColor: '#fff',
        justifyContent: 'center',
    },

    placeholder: {
        fontSize: moderateScale(13),
        color: '#94A3B8',
    },

    /* ===== CHIPS ===== */
    chipsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },

    chip: {
        height: verticalScale(28),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E0E7FF',
        borderRadius: moderateScale(14),
        paddingHorizontal: scale(10),
        marginRight: scale(6),
        marginBottom: verticalScale(6),
    },

    chipText: {
        fontSize: moderateScale(12),
        fontWeight: '600',
        color: '#1E3A8A',
        marginRight: scale(6),
    },

    remove: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: '#1E3A8A',
    },

    /* ===== DROPDOWN ===== */
    dropdown: {
        position: 'absolute',
        top: verticalScale(52),
        left: 0,
        right: 0,
        maxHeight: verticalScale(220),
        backgroundColor: '#fff',
        borderRadius: moderateScale(10),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        zIndex: 1000,
        elevation: 6,
    },

    item: {
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(12),
    },

    selectedItem: {
        backgroundColor: '#F1F5F9',
    },

    disabledItem: {
        backgroundColor: '#F8FAFC',
    },

    itemText: {
        fontSize: moderateScale(14),
        color: '#0F172A',
    },

    disabledText: {
        color: '#94A3B8',
    },
});
