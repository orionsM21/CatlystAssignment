import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const EditLookupForm = ({ item, onChange, onDelete }) => {
    if (!item) return null;

    return (
        <View style={styles.container}>

            <Text style={styles.label}>Lookup Type</Text>
            <TextInput
                value={item.type}
                editable={false}
                style={[styles.input, styles.disabled]}
            />

            <Text style={styles.label}>Lookup Name *</Text>
            <TextInput
                value={item.name}
                onChangeText={(text) =>
                    onChange(item.id, { name: text })
                }
                style={styles.input}
            />

            <Text style={styles.label}>Lookup Code *</Text>
            <TextInput
                value={item.code}
                onChangeText={(text) =>
                    onChange(item.id, { code: text })
                }
                style={styles.input}
            />

            <View style={styles.switchRow}>
                <Text style={styles.label}>Active Status</Text>
                <Switch
                    value={item.active}
                    onValueChange={(val) =>
                        onChange(item.id, { active: val })
                    }
                />
            </View>

            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => onDelete(item)}
            >
                <Icon name="trash-outline" size={18} color="#DC2626" />
                <Text style={styles.deleteText}>Remove</Text>
            </TouchableOpacity>

        </View>
    );
};


export default EditLookupForm;


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    title: {
        fontSize: 16,
        fontWeight: '800',
    },

    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 4,
        marginTop: 10,
    },

    input: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 8,
        padding: 10,
    },

    disabled: {
        backgroundColor: '#E5E7EB',
        color: '#475569',
    },

    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 12,
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },

    saveBtn: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 10,
    },

    saveText: {
        color: '#fff',
        fontWeight: '700',
    },

    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    deleteText: {
        color: '#DC2626',
        marginLeft: 6,
        fontWeight: '600',
    },
});
