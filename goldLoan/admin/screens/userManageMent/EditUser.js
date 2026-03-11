import React, {
    useState,
    useCallback,
    memo,
    useMemo,
    useEffect,
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Switch,
    KeyboardAvoidingView,
    Platform,
    Alert,
    useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    scale,
    verticalScale,
    moderateScale,
} from 'react-native-size-matters';
import AppDropdown from '../../components/AppDropdown';
import { getAllRoles } from '../services/userService';
import MultiSelectDropdown from '../../components/MultiSelectDropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
/* ================= EDIT USER ================= */
export default function EditUser({ route }) {
    const navigation = useNavigation();
    const { user, users } = route.params;
    console.log(user, 'useruser')
    /* ---------- ROLES ---------- */
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [roleFieldHeight, setRoleFieldHeight] = useState(0);

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

    useEffect(() => {
        fetchRoles();
    }, []);

    /* ---------- MANAGERS ---------- */
    const managers = useMemo(() => {
        return users
            .filter(u => u.userId !== user.userId)
            .map(u => ({
                ...u,
                fullName: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
            }));
    }, [users, user.userId]);

    /* ---------- ROLES (disable current role) ---------- */
    const currentRoleId = user?.role?.[0]?.roleId;

    const roleOptions = useMemo(() => {
        return roles.map(r => ({
            roleId: r.roleId,
            roleName: r.roleName,
            disabled: r.roleId === currentRoleId,
        }));
    }, [roles, currentRoleId]);

    /* ---------- FORM STATE ---------- */
    const [form, setForm] = useState({
        userType: user.userType || '',
        userName: user.userName || '',
        firstName: user.firstName || '',
        middleName: user.middleName || '',
        lastName: user.lastName || '',
        mobile: user.mobileNo || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        role: user?.role?.map(r => r.roleId) || [],
        manager: user?.reportingManager ?? null,
    });

    const [active, setActive] = useState(user.enable === true);

    /* ---------- UPDATE FIELD ---------- */
    const updateField = useCallback((key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    }, []);

    /* ---------- SUBMIT ---------- */
    const handleUpdate = useCallback(() => {
        if (!form.userName || !form.firstName || !form.lastName) {
            Alert.alert('Validation Error', 'Please fill all required fields');
            return;
        }

        if (form.password && form.password !== form.confirmPassword) {
            Alert.alert('Validation Error', 'Passwords do not match');
            return;
        }

        const payload = {
            ...form,
            status: active ? 'Active' : 'Inactive',
        };

        if (__DEV__) {
            console.log('UPDATED USER PAYLOAD:', payload);
        }

        Alert.alert('Success', 'User updated successfully');
        navigation.goBack();
    }, [form, active, navigation]);
    const selectedRoleObjects = useMemo(() => {
        return roleOptions.filter(r => form.role.includes(r.roleId));
    }, [roleOptions, form.role]);

    /* ================= UI ================= */
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    style={styles.container}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.header}>Edit User</Text>

                    <FormGrid>
                        {/* <Input label="User Type *" value={form.userType} onChange={v => updateField('userType', v)} /> */}
                        <AppDropdown
                            label="User Type *"
                            value={form.userType}
                            onChange={v => updateField('userType', v)}
                            options={[
                                { label: 'Internal', value: 'Internal' },
                                { label: 'External', value: 'External' },
                            ]}
                        />
                        <Input label="User Name *" value={form.userName} onChange={v => updateField('userName', v)} />



                        <Input label="First Name *" value={form.firstName} onChange={v => updateField('firstName', v)} />
                        <Input label="Middle Name" value={form.middleName} onChange={v => updateField('middleName', v)} />



                        <Input label="Last Name *" value={form.lastName} onChange={v => updateField('lastName', v)} />
                        <Input
                            label="Mobile No *"
                            keyboard="phone-pad"
                            value={form.mobile}
                            onChange={v => updateField('mobile', v)}
                        />



                        <Input
                            label="Email ID *"
                            keyboard="email-address"
                            value={form.email}
                            onChange={v => updateField('email', v)}
                        />

                        <MultiSelectDropdown
                            label="Role *"
                            data={roleOptions}
                            value={form.role}
                            onChange={v => updateField('role', v)}
                            labelField="roleName"
                            valueField="roleId"
                            onHeightChange={setRoleFieldHeight}
                        // span={roleFieldHeight > verticalScale(64) ? 'full' : 1}
                        />






                        <Input label="Password" secure value={form.password} onChange={v => updateField('password', v)} />
                        <Input label="Confirm Password" secure value={form.confirmPassword} onChange={v => updateField('confirmPassword', v)} />


                        <AppDropdown
                            label="Reporting Manager"
                            data={managers}
                            value={Number(form.manager)}
                            onChange={v => updateField('manager', Number(v))}
                            labelField="fullName"
                            valueField="userId"
                        />
                    </FormGrid>
                    <View style={styles.switchRow}>
                        <Text style={styles.label}>Active Status *</Text>
                        <Switch value={active} onValueChange={setActive} />
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                            <Text style={styles.saveText}>UPDATE</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                            <Text style={styles.cancelText}>CANCEL</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

/* ================= REUSABLE ================= */
const Row = memo(({ children }) => (
    <View style={styles.row}>{children}</View>
));

const Input = memo(
    ({ label, value, onChange, secure, keyboard }) => (
        <View style={styles.inputBox}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                secureTextEntry={secure}
                keyboardType={keyboard}
                autoCapitalize="none"
            />
        </View>
    )
);

const FormGrid = ({ children, gap = 12 }) => {
    const { width } = useWindowDimensions();

    const columns = useMemo(() => {
        if (width >= 1024) return 4;   // large tablet
        if (width >= 768) return 3;    // tablet
        return 2;                      // phone
    }, [width]);

    return (
        <View style={[styles.grid, { marginHorizontal: -gap / 2 }]}>
            {React.Children.map(children, child => {
                if (!child) return null;

                const span = child.props.span ?? 1;
                const colSpan = span === 'full' ? columns : Math.min(span, columns);

                const widthPercent = `${(colSpan / columns) * 100}%`;

                return (
                    <View
                        style={[
                            styles.cell,
                            {
                                width: widthPercent,
                                paddingHorizontal: gap / 2,
                                marginBottom: gap,
                            },
                        ]}
                    >
                        {child}
                    </View>
                );
            })}
        </View>
    );
};

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        padding: moderateScale(16),

    },
    header: {
        fontSize: moderateScale(22),
        fontWeight: '800',
        marginBottom: verticalScale(16),
        color: '#0F172A',
    },
    row: {
        flexDirection: 'row',
        gap: moderateScale(12),
        // overflow: 'visible', // ✅ REQUIRED
    },
    inputBox: {
        flex: 1,
        marginBottom: verticalScale(12),
    },
    label: {
        fontSize: moderateScale(12),
        fontWeight: '700',
        color: '#475569',
        marginBottom: verticalScale(4),
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: moderateScale(10),
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(10),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        color: '#000',
        minHeight: moderateScale(44),
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: verticalScale(16),
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: verticalScale(20),
        marginBottom: verticalScale(40),
    },
    saveBtn: {
        backgroundColor: '#2563EB',
        paddingVertical: verticalScale(14),
        borderRadius: moderateScale(12),
        width: '48%',
        alignItems: 'center',
    },
    saveText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: moderateScale(14),
    },
    cancelBtn: {
        backgroundColor: '#EF4444',
        paddingVertical: verticalScale(14),
        borderRadius: moderateScale(12),
        width: '48%',
        alignItems: 'center',
    },
    cancelText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: moderateScale(14),
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    cell: {
        justifyContent: 'flex-start',
    },
});
