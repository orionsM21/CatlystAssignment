import React from 'react';
import {
    View,
    Text,
    TextInput,
    Switch,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CreateLookupBlock = ({ item, onChange, onRemove, canRemove }) => {
    return (
        <View style={styles.block}>

            {/* HEADER */}
            <View style={styles.headerRow}>
                <Text style={styles.blockTitle}>New Lookup</Text>

                {canRemove && (
                    <TouchableOpacity onPress={() => onRemove(item.id)}>
                        <Icon name="trash-outline" size={18} color="#DC2626" />
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.label}>Lookup Type *</Text>
            <TextInput
                value={item.lookupType}
                onChangeText={(text) =>
                    onChange(item.id, { lookupType: text })
                }
                style={styles.input}
            />

            <Text style={styles.label}>Lookup Name *</Text>
            <TextInput
                value={item.lookupName}
                onChangeText={(text) =>
                    onChange(item.id, { lookupName: text })
                }
                style={styles.input}
            />

            <Text style={styles.label}>Lookup Code *</Text>
            <TextInput
                value={item.lookupCode}
                onChangeText={(text) =>
                    onChange(item.id, { lookupCode: text })
                }
                style={styles.input}
            />

            <View style={styles.switchRow}>
                <Text style={styles.label}>Active</Text>
                <Switch
                    value={item.active}
                    onValueChange={(val) =>
                        onChange(item.id, { active: val })
                    }
                />
            </View>

        </View>
    );
};

export default CreateLookupBlock;


const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },

    blockTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0F172A',
    },

    block: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        marginBottom: 14,
        elevation: 2,              // Android shadow
        shadowColor: '#000',       // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
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
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: '#0F172A',
        backgroundColor: '#FFFFFF',
    },

    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 14,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
});
