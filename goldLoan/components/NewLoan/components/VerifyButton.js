import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const VerifyButton = React.memo(({ label, onPress }) => {
  if (!label) return null;

  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 6,
    marginVertical: 10,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
