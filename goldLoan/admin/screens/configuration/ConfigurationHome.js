import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CONFIG_ITEMS = [
    { title: 'Business Date', key: 'BUSINESS_DATE', icon: 'calendar-outline' },
    { title: 'Portfolio Master', key: 'PORTFOLIO', icon: 'briefcase-outline' },
    { title: 'Product Master', key: 'PRODUCT', icon: 'cube-outline' },
    { title: 'Sub Product Master', key: 'SUB_PRODUCT', icon: 'layers-outline' },
    { title: 'Scheme Master', key: 'SCHEME', icon: 'layers-outline' },
    { title: 'Gold Rate Master', key: 'GOLD_RATE', icon: 'layers-outline' },
];

export default function ConfigurationHome({ navigation }) {
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() =>
                navigation.navigate('ConfigList', {
                    configKey: item.key,
                    title: item.title,
                })
            }
        >
            <Icon name={item.icon} size={26} color="#2563EB" />
            <Text style={styles.text}>{item.title}</Text>
            <Icon name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Configuration</Text>

            <FlatList
                data={CONFIG_ITEMS}
                keyExtractor={item => item.key}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        padding: 16,
    },
    header: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 20,
        color: '#0F172A',
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 3,
    },
    text: {
        flex: 1,
        marginLeft: 14,
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    separator: {
        height: 12,
    },
});
