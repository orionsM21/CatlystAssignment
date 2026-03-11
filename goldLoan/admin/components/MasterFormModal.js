import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    Switch,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { MASTER_CONFIG } from './masterConfig';
import createApiClient from '../../common/hooks/apiClient';



const api = createApiClient('gold');

const MasterFormModal = ({ visible, onClose, config, data, onSuccess, mode }) => {
    const [form, setForm] = useState({});
    const [dropdownData, setDropdownData] = useState({});

    useEffect(() => {
        if (mode === 'add') {
            setForm({ active: true });
        } else if (data) {
            setForm(data);
        }
    }, [data, mode]);

    useEffect(() => {
        if (!visible) return;

        const loadDropdowns = async () => {
            const dropdownFields = config.form.filter(f => f.type === 'dropdown');

            for (const field of dropdownFields) {
                const sourceConfig = MASTER_CONFIG[field.source];
                const res = await api.get(sourceConfig.api.list);

                const list =
                    res?.data?.data?.content ??
                    res?.data?.data ??
                    [];

                setDropdownData(prev => ({
                    ...prev,
                    [field.key]: list,
                }));
            }
        };

        loadDropdowns();
    }, [visible, config.form]);


    const updateField = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const submitForm = async () => {
        try {
            const isEdit = !!form[config.primaryKey];

            const apiName = isEdit
                ? config.api.update
                : config.api.create;

            await api.post(apiName, form);
            onSuccess();

            onClose();
        } catch (error) {
            console.log('Submit Error', error);
        }
    };


    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* <Text style={styles.title}>
                        Update {config.title}
                    </Text> */}
                    <Text style={styles.title}>
                        {mode === 'add'
                            ? `Add ${config.title}`
                            : mode === 'view'
                                ? `View ${config.title}`
                                : `Update ${config.title}`}
                    </Text>


                    {config.form.map(field => {
                        if (field.type === 'text') {
                            return (
                                <TextInput
                                    key={field.key}
                                    style={styles.input}
                                    placeholder={field.label}
                                    value={form[field.key]?.toString() || ''}
                                    onChangeText={val => updateField(field.key, val)}
                                    editable={mode !== 'view'}

                                />
                            );
                        }

                        if (field.type === 'switch') {
                            return (
                                <View key={field.key} style={styles.switchRow}>
                                    <Text>{field.label}</Text>
                                    <Switch
                                        value={!!form[field.key]}
                                        onValueChange={val => updateField(field.key, val)}
                                        disabled={mode === 'view'}
                                    />
                                </View>
                            );
                        }

                        if (field.type === 'dropdown') {
                            return (
                                <Dropdown
                                    key={field.key}
                                    style={styles.dropdown}
                                    data={dropdownData[field.key] || []}
                                    labelField={field.labelKey}
                                    valueField={field.valueKey}
                                    placeholder={`Select ${field.label}`}
                                    value={form[field.key]}
                                    onChange={item =>
                                        updateField(field.key, item[field.valueKey])
                                    }
                                    disable={mode === 'view'}
                                />
                            );
                        }

                        return null;
                    })}

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.close}>CLOSE</Text>
                        </TouchableOpacity>

                        {mode !== 'view' && (
                            <TouchableOpacity onPress={submitForm}>
                                <Text style={styles.submit}>SUBMIT</Text>
                            </TouchableOpacity>
                        )}

                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default MasterFormModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#00000080',
        justifyContent: 'center',
    },
    container: {
        margin: 20,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 12,
        paddingVertical: 6,
    },
    dropdown: {
        marginBottom: 12,
        borderBottomWidth: 1,
        paddingVertical: 6,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    close: {
        marginRight: 20,
        color: '#DC2626',
        fontWeight: '700',
    },
    submit: {
        color: '#2563EB',
        fontWeight: '700',
    },
});
