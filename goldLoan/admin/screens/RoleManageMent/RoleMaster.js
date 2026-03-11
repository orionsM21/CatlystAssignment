import React, { memo, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllRoles } from '../services/userService';

import { useFocusEffect } from '@react-navigation/native';
import createApiClient from '../common/hooks/apiClient';


// const ROLES = [
//   { id: 'ADMIN', name: 'Admin', active: true },
//   { id: 'GLO', name: 'GLO', active: true },
//   { id: 'SALES', name: 'Sales', active: true },
// ];
const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

const RoleCard = memo(
  ({ item, onEdit }) => {
    const statusText = item.active ? 'Active' : 'Inactive';

    return (
      <View style={styles.card}>
        <View>
          <Text style={styles.roleName}>{item.roleName}</Text>
          <Text style={styles.roleCode}>Code • {item.roleId}</Text>
        </View>

        <View style={styles.right}>
          <Text style={[styles.status, item.active && styles.active]}>
            {statusText}
          </Text>

          <TouchableOpacity onPress={() => onEdit(item)} hitSlop={HIT_SLOP}>
            <Icon name="create-outline" size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>
      </View>
    );
  },
  (prev, next) =>
    prev.item.id === next.item.id &&
    prev.item.active === next.item.active &&
    prev.item.name === next.item.name
);



export default function RoleMaster({ navigation }) {
  const api = createApiClient('gold');
  const [Roles, setRoles] = useState([])
  const [roleaccess, setroleaccess] = useState([])
  console.log(roleaccess, 'roleaccessroleaccess')
  const [loading, setLoading] = useState(false)
  const handleEdit = useCallback(
    role => navigation.navigate('CreateRole', { role }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }) => <RoleCard item={item} onEdit={handleEdit} />,
    [handleEdit],
  );
  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllRoles();
      setRoles(res?.data?.data?.content || []);
    } catch (err) {
      Alert.alert('Error', err?.message || 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  }, []);
  // const getRoleById = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const res = await api.get(`getRoleById/1`);
  //     setroleaccess(res?.data?.data || []);
  //   } catch (err) {
  //     Alert.alert('Error', err?.message || 'Failed to load roles');
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  useEffect(() => {
    fetchRoles();
    // getRoleById();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRoles();
    }, [])
  );


  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Roles</Text>

          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => navigation.navigate('CreateRole')}
          >
            <Icon name="add" size={moderateScale(18)} color="#fff" />
            <Text style={styles.createText}>CREATE</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={Roles}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
          removeClippedSubviews
          ListEmptyComponent={
            <Text style={styles.empty}>No roles found</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: moderateScale(16),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
  },

  title: {
    fontSize: moderateScale(22),
    fontWeight: '800',
    color: '#0F172A',
  },

  createBtn: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },

  createText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: moderateScale(6),
    fontSize: moderateScale(12),
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(14),
    padding: moderateScale(14),
    marginBottom: verticalScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 4,
  },

  roleName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
  },

  roleCode: {
    color: '#64748B',
    marginTop: verticalScale(4),
    fontSize: moderateScale(12),
  },

  right: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  status: {
    fontSize: moderateScale(12),
    fontWeight: '700',
  },

  active: {
    color: '#16A34A',
  },

  empty: {
    textAlign: 'center',
    marginTop: verticalScale(40),
    color: '#64748B',
  },
});

