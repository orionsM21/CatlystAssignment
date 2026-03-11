import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';

const AppDropdown = ({
  label,
  data,
  options,                    // static options support
  value,
  onChange,
  labelField = 'label',
  valueField = 'value',
  placeholder = 'Select',
  error,
  multiple = false,
  full,
}) => {
  const Component = multiple ? MultiSelect : Dropdown;

  /* ===============================
     🔥 Normalize data (CRITICAL FIX)
     =============================== */
  const finalData = useMemo(() => {
    const source = Array.isArray(options)
      ? options
      : Array.isArray(data)
        ? data
        : [];

    return source.map(item => ({
      ...item,
      [valueField]: item?.[valueField] != null
        ? Number(item[valueField])   // 🔥 FORCE NUMBER
        : item[valueField],
    }));
  }, [options, data, valueField]);

  /* ===============================
     🔥 Normalize value
     =============================== */
  const safeValue = useMemo(() => {
    if (multiple) {
      return Array.isArray(value)
        ? value.map(v => Number(v))
        : [];
    }
    return value != null ? Number(value) : null;
  }, [value, multiple]);

  return (
    <View style={[styles.container, full && styles.full]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Component
        data={finalData}
        value={safeValue}
        labelField={labelField}
        valueField={valueField}
        placeholder={placeholder}
        style={styles.dropdown}
        selectedTextStyle={styles.selectedText}
        placeholderStyle={styles.placeholderText}

        onChange={items => {
          if (!items) return;

          if (multiple) {
            const ids = items
              .filter(i => i?.[valueField] != null)
              .map(i => Number(i[valueField]));

            onChange(ids);
          } else {
            onChange(Number(items[valueField]));
          }
        }}

        renderItem={item => {
          if (!item) return null;

          const isDisabled = !!item.disabled;

          return (
            <View
              style={[
                styles.item,
                isDisabled && styles.disabledItem,
              ]}
            >
              <Text
                style={[
                  styles.itemText,
                  isDisabled && styles.disabledText,
                ]}
              >
                {item[labelField]}
              </Text>
            </View>
          );
        }}
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default memo(AppDropdown);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    marginBottom: 12,
  },
  full: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    color: '#475569',
  },
  dropdown: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  selectedText: {
    fontSize: 14,
    color: '#0F172A',
  },
  placeholderText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  item: {
    padding: 12,
  },
  itemText: {
    fontSize: 14,
    color: '#0F172A',
  },
  disabledItem: {
    backgroundColor: '#F1F5F9',
  },
  disabledText: {
    color: '#94A3B8',
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});
