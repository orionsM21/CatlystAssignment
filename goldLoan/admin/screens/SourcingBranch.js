// SourcingBranch.js
import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SourcingBranch = ({ navigation }) => {
  const openMaster = useCallback(() => {
    navigation.navigate('MasterScreen', { type: 'SOURCING_BRANCH' });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={openMaster}>
        <Icon name="git-branch-outline" size={24} color="#2563EB" />
        <Text style={styles.text}>Sourcing Branch Master</Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(SourcingBranch);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
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
