import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';

/* ================= INPUT ================= */
export const renderInput = (
  label,
  value,
  onChange,
  options = {}
) => {
  const {
    editable = true,
    placeholder = '',
    isMobile = false,
    isPan = false,
    isAadhaar = false,
  } = options;

  let keyboardType = 'default';
  let maxLength;

  if (isMobile) {
    keyboardType = 'numeric';
    maxLength = 10;
  }

  if (isAadhaar) {
    keyboardType = 'numeric';
    maxLength = 12;
  }

  if (isPan) {
    maxLength = 10;
  }

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[
          styles.input,
          !editable && styles.disabledInput,
        ]}
        value={value}
        onChangeText={onChange}
        editable={editable}
        placeholder={placeholder}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize={isPan ? 'characters' : 'none'}
      />
    </View>
  );
};

/* ================= DROPDOWN ================= */
export const renderDropdown = (
  label,
  data,
  value,
  onChange,
  placeholder = 'Select'
) => {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <Dropdown
        data={data}
        labelField="label"
        valueField="value"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        style={styles.dropdown}
        selectedTextStyle={styles.selectedText}
      />
    </View>
  );
};

/* ================= DATE PICKER ================= */
export const DatePickerInput = ({ label, value, onChange }) => {
  const [show, setShow] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShow(true)}
      >
        <Text style={{ color: value ? '#000' : '#999' }}>
          {value || `Select ${label}`}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, selectedDate) => {
            setShow(false);
            if (selectedDate) {
              const formatted =
                selectedDate.toISOString().split('T')[0];
              onChange(formatted);
            }
          }}
        />
      )}
    </View>
  );
};

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#f3f4f6',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 44,
    backgroundColor: '#fff',
  },
  selectedText: {
    fontSize: 14,
  },
});
