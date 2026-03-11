

import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const GEO_MENU = [
  { label: 'Country', type: 'COUNTRY', icon: 'flag-outline' },
  { label: 'Zone', type: 'ZONE', icon: 'globe-outline' },
  { label: 'Region', type: 'REGION', icon: 'map-outline' },
  { label: 'State', type: 'STATE', icon: 'business-outline' },
  { label: 'City', type: 'CITY', icon: 'location-outline' },
  { label: 'Pincode', type: 'PINCODE', icon: 'mail-outline' },
];

const GeographyMaster = ({ navigation }) => {
  const onPressItem = useCallback(
    type => {
      navigation.navigate('MasterScreen', { type });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPressItem(item.type)}
        activeOpacity={0.7}
      >
        <Icon name={item.icon} size={22} color="#2563EB" />
        <Text style={styles.text}>{item.label}</Text>
      </TouchableOpacity>
    ),
    [onPressItem]
  );

  return (
    <FlatList
      data={GEO_MENU}
      keyExtractor={item => item.type}
      renderItem={renderItem}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
    />
  );
};

export default memo(GeographyMaster);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 28,
    alignItems: 'center',
    elevation: 4,
  },

  text: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
});
