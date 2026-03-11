import React, { useState, useCallback, memo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Switch,
    TouchableOpacity,
    Alert,
    useColorScheme,
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import createApiClient from '../common/hooks/apiClient';


/* ================= PERMISSIONS ================= */
const PERMISSIONS = [
    { section: 'Administration', items: ['User', 'Role'] },
    {
        section: 'Master Setup',
        items: [
            'Lookup Master',
            'Geography Master',
            'Document Master',
            'Fee Master',
            'Bank Branch Master',
            'Sourcing Branch',
        ],
    },
    {
        section: 'Configuration',
        items: [
            'Business Date',
            'Portfolio Master',
            'Product Master',
            'Sub Product Master',
        ],
    },
    {
        section: 'Customer Acquisition',
        items: [
            'Customer Details',
            'Gold Details',
            'Document Upload',
            'KYC & Bureue',
        ],
    },
];

/* ================= BACKEND → UI KEY MAP ================= */
const ACCESS_KEY_MAP = {
    // ===== Administration =====
    User: {
        section: 'administration_all',
        item: 'administration_user',
    },
    Role: {
        section: 'administration_all',
        item: 'administration_role',
    },

    // ===== Master Setup =====
    'Lookup Master': {
        section: 'master_all',
        item: 'master_lookupmaster',
    },
    'Geography Master': {
        section: 'master_all',
        item: 'master_geographymaster',
    },
    'Document Master': {
        section: 'master_all',
        item: 'master_documentmaster',
    },
    'Fee Master': {
        section: 'master_all',
        item: 'master_feemaster',
    },
    'Bank Branch Master': {
        section: 'master_all',
        item: 'master_bankbranchmaster',
    },
    'Sourcing Branch': {
        section: 'master_all',
        item: 'master_sourcingbranch',
    },

    // ===== Configuration =====
    'Business Date': {
        section: 'configuration_all',
        item: 'configuration_businessdate',
    },
    'Portfolio Master': {
        section: 'configuration_all',
        item: 'configuration_portfoliomaster',
    },
    'Product Master': {
        section: 'configuration_all',
        item: 'configuration_productmaster',
    },
    'Sub Product Master': {
        section: 'configuration_all',
        item: 'configuration_subproductmaster',
    },

    // ===== Customer Acquisition =====
    'Customer Details': {
        section: 'customeracquisition_all',
        item: 'customeracquisition_customerdetails',
    },
    'Gold Details': {
        section: 'customeracquisition_all',
        item: 'customeracquisition_golddetails',
    },
    'Document Upload': {
        section: 'customeracquisition_all',
        item: 'customeracquisition_documentupload',
    },
    'KYC & Bureue': {
        section: 'customeracquisition_all',
        item: 'customeracquisition_kycbureue',
    },
};



/* ================= PERMISSION SELECTOR ================= */
const PermissionSelector = memo(({ value, onChange }) => {
    const isDark = useColorScheme() === 'dark';
    const levels = ['View', 'Edit', 'Full'];

    return (
        <View style={styles.selector}>
            {levels.map(level => {
                const isActive = value === level;

                return (
                    <TouchableOpacity
                        key={level}
                        style={[
                            styles.option,
                            isActive && styles.activeOption,
                        ]}
                        onPress={() => onChange(level)}
                    >
                        <Text style={[
                            styles.optionText,
                            isActive && styles.activeText,
                        ]}>
                            {level}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
});

/* ================= MAIN SCREEN ================= */
export default function CreateRole({ route, navigation }) {
    const role = route?.params?.role;
    const isDark = useColorScheme() === 'dark';
    const api = createApiClient('gold');

    const [code, setCode] = useState(role?.roleCode || '');
    const [name, setName] = useState(role?.roleName || '');
    const [active, setActive] = useState(role?.active ?? true);
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(false);

    /* ================= FLAG → PERMISSION ================= */
    const resolvePermission = useCallback((access, keys) => {
        const itemValue = access[keys.item];
        const sectionValue = access[keys.section];

        // ITEM LEVEL (highest priority)
        if (itemValue === 'F') return 'Full';
        if (itemValue === 'E') return 'Edit';
        if (itemValue === 'V') return 'View';

        // SECTION LEVEL (inherit ONLY if item is missing)
        if (sectionValue === 'F') return 'Full';
        if (sectionValue === 'E') return 'Edit';
        if (sectionValue === 'V') return 'View';

        // ❌ No access at all
        return null;
    }, []);




    /* ================= FETCH ROLE ================= */
    const getRoleById = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`getRoleById/${role?.roleId}`);
            const data = res?.data?.data;

            if (!data?.access) return;

            const parsedAccess = JSON.parse(data.access);
            const mappedPermissions = {};

            Object.entries(ACCESS_KEY_MAP).forEach(([uiKey, backendKeys]) => {
                mappedPermissions[uiKey] = resolvePermission(parsedAccess, backendKeys);
            });

            setPermissions(mappedPermissions);
            console.log('RAW ACCESS:', parsedAccess);
            console.log('MAPPED PERMISSIONS:RAW ACCESS:', mappedPermissions);

        } catch (err) {
            Alert.alert('Error', err?.message || 'Failed to load role');
        } finally {
            setLoading(false);
        }
    }, [api, role?.roleId, resolvePermission]);

    /* ================= EFFECT ================= */
    useEffect(() => {
        if (role?.roleId) {
            getRoleById();
        }
    }, [role?.roleId, getRoleById]);

    /* ================= UPDATE PERMISSION ================= */
    const updatePermission = useCallback((key, value) => {
        setPermissions(prev => ({ ...prev, [key]: value }));
    }, []);

    /* ================= SUBMIT ================= */


    const toBackendFlag = (level) => {
        if (level === 'Full') return 'F';
        if (level === 'Edit') return 'E';
        if (level === 'View') return 'V';
        return null;
    };

    const buildAccessPayload = (permissions) => {
        const access = {};

        Object.entries(ACCESS_KEY_MAP).forEach(([uiKey, keys]) => {
            const value = toBackendFlag(permissions[uiKey]);

            // ITEM LEVEL
            if (value !== null) {
                access[keys.item] = value;
            } else {
                access[keys.item] = null;
            }
        });

        return access;
    };

    const handleSubmit = useCallback(async () => {
        if (!code || !name) {
            Alert.alert('Validation Error', 'Role Code and Name are required');
            return;
        }

        const accessPayload = buildAccessPayload(permissions);

        const payload = {
            roleCode: code,
            roleName: name,
            active,
            access: JSON.stringify(accessPayload),
        };

        try {
            setLoading(true);

            if (role?.roleId) {
                // 🔁 UPDATE ROLE
                await api.put(`updateRole/${role?.roleId}`, {
                    roleId: role.roleId,
                    ...payload,
                });

                Alert.alert('Success', 'Role updated successfully');
            } else {
                // ➕ CREATE ROLE
                await api.post('createRole', payload);

                Alert.alert('Success', 'Role created successfully');
            }

            navigation.goBack();
        } catch (err) {
            Alert.alert(
                'Error',
                err?.response?.data?.message || err?.message || 'Something went wrong'
            );
        } finally {
            setLoading(false);
        }
    }, [code, name, active, permissions, role?.roleId, api, navigation]);


    return (
        <ScrollView
            style={[
                styles.container,
                { backgroundColor: isDark ? '#020617' : '#F8FAFC' },
            ]}
            showsVerticalScrollIndicator={false}
        >
            <Text style={[styles.title, { color: isDark ? '#F8FAFC' : '#000' }]}>
                {role ? 'Edit Role' : 'Create Role'}
            </Text>

            <TextInput
                placeholder="Role Code"
                value={code}
                onChangeText={setCode}
                style={[
                    styles.input,
                    { backgroundColor: isDark ? '#020617' : '#fff', color: isDark ? '#E5E7EB' : '#000' },
                ]}
            />

            <TextInput
                placeholder="Role Name"
                value={name}
                onChangeText={setName}
                style={[
                    styles.input,
                    { backgroundColor: isDark ? '#020617' : '#fff', color: isDark ? '#E5E7EB' : '#000' },
                ]}
            />

            <View style={styles.row}>
                <Text style={{ fontWeight: '700', color: active ? '#16A34A' : '#DC2626' }}>
                    {active ? 'Active' : 'Inactive'}
                </Text>

                <Switch value={active} onValueChange={setActive} />
            </View>

            <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#000' }]}>
                Permissions
            </Text>

            {PERMISSIONS.map(section => (
                <View
                    key={section.section}
                    style={[
                        styles.permissionCard,
                        { backgroundColor: isDark ? '#020617' : '#fff' },
                    ]}
                >
                    <Text style={styles.permissionTitle}>{section.section}</Text>

                    {section.items.map(item => (
                        <View key={item} style={styles.permissionRow}>
                            <Text style={{ marginBottom: 6, color: isDark ? '#CBD5E1' : '#64748B' }}>
                                {item}
                            </Text>

                            <PermissionSelector
                                value={permissions[item]}
                                onChange={value => updatePermission(item, value)}
                            />
                        </View>
                    ))}
                </View>
            ))}

            <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
                <Text style={styles.saveText}>
                    {role ? 'UPDATE ROLE' : 'CREATE ROLE'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    container: { flex: 1, padding: moderateScale(16) },
    title: { fontSize: moderateScale(22), fontWeight: '800', marginBottom: verticalScale(20) },
    input: { borderRadius: moderateScale(12), padding: moderateScale(14), marginBottom: verticalScale(12) },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: verticalScale(16) },
    sectionTitle: { fontSize: moderateScale(18), fontWeight: '800', marginVertical: verticalScale(16) },
    permissionCard: { borderRadius: moderateScale(14), padding: moderateScale(14), marginBottom: verticalScale(14) },
    permissionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1E40AF',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 6,
    },
    permissionRow: { marginBottom: verticalScale(12) },
    selector: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
    option: { flex: 1, paddingVertical: 10, alignItems: 'center' },
    optionText: { fontSize: 13 },
    saveBtn: {
        backgroundColor: '#2563EB',
        paddingVertical: verticalScale(14),
        borderRadius: moderateScale(12),
        marginBottom: verticalScale(40),
        alignItems: 'center',
    },
    saveText: { color: '#fff', fontWeight: '800', fontSize: moderateScale(14) },
    selector: {
        flexDirection: 'row',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        overflow: 'hidden',
        backgroundColor: '#F8FAFC',
    },

    option: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },

    optionText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569', // slate-600
    },

    /* ================= ACTIVE STATES ================= */

    activeOption: {
        backgroundColor: '#DBEAFE', // light blue
    },

    activeText: {
        color: '#1D4ED8', // blue-700
        fontWeight: '800',
    },
});
