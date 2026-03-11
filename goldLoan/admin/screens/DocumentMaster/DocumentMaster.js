// DocumentMaster.js
import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const DOCUMENT_MENU = [
  { label: 'Document Master', type: 'DOCUMENT', icon: 'document-text-outline' },
  { label: 'Document Group', type: 'DOCUMENT_GROUP', icon: 'folder-outline' },
];

const DocumentMaster = ({ navigation }) => {
  const onPressItem = useCallback(
    type => {
      navigation.navigate('MasterScreen', { type });
    },
    [navigation]
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPressItem(item.type)}
    >
      <Icon name={item.icon} size={22} color="#2563EB" />
      <Text style={styles.text}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={DOCUMENT_MENU}
      keyExtractor={item => item.type}
      renderItem={renderItem}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
    />
  );
};

export default memo(DocumentMaster);

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
