import React, { useCallback, memo, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { getAllUsers } from '../services/userService';
const USERS = [
    {
        id: 'harendra',

        // 🔹 User Identity
        userType: 'Internal',
        userName: 'harendra.kumar',

        // 🔹 Personal Details
        firstName: 'Harendra',
        middleName: '',
        lastName: 'Kumar',

        // 🔹 Contact
        mobile: '9876543210',
        email: 'harendra.kumar@company.com',

        // 🔹 Access & Hierarchy
        role: 'GLO',
        manager: 'Regional Manager',

        // 🔹 Status
        status: 'Active',

        // 🔹 Auth (usually not sent from backend in real apps)
        password: '',
        confirmPassword: '',
    },
    {
        id: 'sejal',

        userType: 'Internal',
        userName: 'sejal.sawant',

        firstName: 'Sejal',
        middleName: '',
        lastName: 'Sawant',

        mobile: '9123456789',
        email: 'sejal.sawant@company.com',

        role: 'Sales',
        manager: 'Sales Head',

        status: 'Active',

        password: '',
        confirmPassword: '',
    },
];

/* -------------------- CARD -------------------- */
const UserCard = memo(({ item, onEdit }) => {
    return (
        <View style={styles.card}>
            <View>
                <Text style={styles.name}>{item.userName}</Text>
                <Text style={styles.meta}>
                    {item.role?.map(r => r.roleName).join(', ')} • {item.userType}
                </Text>
            </View>

            <View style={styles.right}>
                <Text
                    style={[
                        styles.status,
                        item.enable && styles.active,
                    ]}
                >
                    {item.enable ? 'Active' : 'Inactive'}
                </Text>

                <TouchableOpacity onPress={() => onEdit(item)}>
                    <Icon name="create-outline" size={20} color="#2563EB" />
                </TouchableOpacity>
            </View>
        </View>
    );
});


export default function UserListScreen({ navigation }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const handleEdit = useCallback(
        user => {
            navigation.navigate('EditUser', {
                user,
                users, // 👈 pass full list
            });
        },
        [navigation, users],
    );


    const renderItem = useCallback(
        ({ item }) => <UserCard item={item} onEdit={handleEdit} />,
        [handleEdit],
    );
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getAllUsers();
            console.log(res.data.data.content)
            setUsers(res.data.data.content || []);
        } catch (err) {
            Alert.alert('Error', err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Users</Text>

                    <TouchableOpacity
                        style={styles.createBtn}
                        onPress={() => navigation.navigate('CreateUser')}
                    >
                        <Icon name="add" size={18} color="#fff" />
                        <Text style={styles.createText}>CREATE</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={users}
                    keyExtractor={item => item.userId.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={6}
                    removeClippedSubviews
                    ListEmptyComponent={
                        <Text style={styles.empty}>No users found</Text>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
    safe: { flex: 1 },
    container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },

    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0F172A',
    },

    createBtn: {
        flexDirection: 'row',
        backgroundColor: '#2563EB',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        alignItems: 'center',
    },

    createText: {
        color: '#fff',
        fontWeight: '700',
        marginLeft: 6,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        elevation: 4,
    },

    name: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },

    meta: {
        color: '#64748B',
        marginTop: 4,
    },

    right: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },

    status: {
        fontSize: 12,
        fontWeight: '700',
    },

    active: {
        color: '#16A34A',
    },

    empty: {
        textAlign: 'center',
        color: '#64748B',
        marginTop: 40,
    },
});
