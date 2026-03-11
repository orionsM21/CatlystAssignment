import React, { useState, useCallback, memo } from 'react';
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
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const INITIAL_FORM = {
    userType: '',
    userName: '',
    firstName: '',
    middleName: '',
    lastName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    manager: '',
    role: '',
};

export default function CreateUserScreen({ navigation }) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [active, setActive] = useState(true);

    const updateField = useCallback((key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleSubmit = useCallback(() => {
        if (!form.userName || !form.firstName || !form.lastName) {
            Alert.alert('Validation Error', 'Please fill all required fields');
            return;
        }

        if (form.password !== form.confirmPassword) {
            Alert.alert('Validation Error', 'Passwords do not match');
            return;
        }

        console.log('Form Data:', { ...form, active });
        Alert.alert('Success', 'User created successfully');
        navigation.goBack();
    }, [form, active, navigation]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                style={styles.container}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.header}>Create User</Text>

                {/* ROW 1 */}
                <Row>
                    <Input label="User Type *" value={form.userType} onChange={v => updateField('userType', v)} />
                    <Input label="User Name *" value={form.userName} onChange={v => updateField('userName', v)} />
                </Row>

                {/* ROW 2 */}
                <Row>
                    <Input label="First Name *" value={form.firstName} onChange={v => updateField('firstName', v)} />
                    <Input label="Middle Name" value={form.middleName} onChange={v => updateField('middleName', v)} />
                </Row>

                {/* ROW 3 */}
                <Row>
                    <Input label="Last Name *" value={form.lastName} onChange={v => updateField('lastName', v)} />
                    <Input label="Mobile No *" keyboard="phone-pad" value={form.mobile} onChange={v => updateField('mobile', v)} />
                </Row>

                {/* ROW 4 */}
                <Row>
                    <Input label="Email ID *" keyboard="email-address" value={form.email} onChange={v => updateField('email', v)} />
                    <Input label="Role *" value={form.role} onChange={v => updateField('role', v)} />
                </Row>

                {/* ROW 5 */}
                <Row>
                    <Input label="Password *" secure value={form.password} onChange={v => updateField('password', v)} />
                    <Input label="Confirm Password *" secure value={form.confirmPassword} onChange={v => updateField('confirmPassword', v)} />
                </Row>

                <Input label="Reporting Manager" value={form.manager} onChange={v => updateField('manager', v)} />

                <View style={styles.switchRow}>
                    <Text style={styles.label}>Active Status *</Text>
                    <Switch value={active} onValueChange={setActive} />
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                        <Text style={styles.submitText}>SUBMIT</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.cancelText}>CANCEL</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

/* -------------------- ROW -------------------- */
const Row = ({ children }) => (
    <View style={styles.row}>{children}</View>
);

/* -------------------- INPUT -------------------- */
const Input = memo(({ label, value, onChange, secure, keyboard }) => (
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
));

/* -------------------- STYLES -------------------- */
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
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },

    inputBox: {
        width: '48%',
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
        padding: moderateScale(12),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        color: '#000'
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

    submitBtn: {
        backgroundColor: '#2563EB',
        paddingVertical: verticalScale(14),
        borderRadius: moderateScale(12),
        width: '48%',
        alignItems: 'center',
    },

    submitText: {
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
});
