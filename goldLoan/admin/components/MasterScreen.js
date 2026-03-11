import React, {
    useEffect,
    useState,
    useCallback,
    memo, useMemo,
    useLayoutEffect,
} from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { MASTER_CONFIG } from './masterConfig';

import MasterFormModal from './MasterFormModal';
import createApiClient from '../../common/hooks/apiClient';

const api = createApiClient('gold');
const TableHeader = ({ columns = [] }) => {
    if (!columns.length) return null;

    return (
        <View style={{ flexDirection: 'row', paddingVertical: 8 }}>
            {columns.map(col => (
                <Text
                    key={col.key}
                    style={{ flex: 1, fontWeight: '700' }}
                >
                    {col.label}
                </Text>
            ))}
            <Text style={{ width: 80, fontWeight: '700' }}>Actions</Text>
        </View>
    );
};


const renderRow = (item, config, openEditModal, openViewModal) => {
    if (!config.columns?.length) return null;

    return (
        <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
            {config.columns.map(col => (
                <Text key={col.key} style={{ flex: 1 }}>
                    {col.type === 'status'
                        ? item[col.key] ? 'Active' : 'Inactive'
                        : item[col.key]}
                </Text>
            ))}

            <View style={{ width: 80, flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => openViewModal(item)}>
                    <Text>👁</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openEditModal(item)}>
                    <Text>✏️</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}
const renderCard = (item, config, openEditModal, openViewModal) => (
    <View
        style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 14,
            marginBottom: 12,
            elevation: 2,
        }}
    >
        {config.columns.map(col => (
            <View key={col.key} style={{ flexDirection: 'row', marginBottom: 6 }}>
                <Text style={{ width: 130, color: '#64748B', fontWeight: '600' }}>
                    {col.label}:
                </Text>

                <Text style={{ flex: 1, color: '#0F172A' }}>
                    {col.type === 'status'
                        ? item[col.key] ? 'Active' : 'Inactive'
                        : item[col.key] ?? '-'}
                </Text>
            </View>
        ))}

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
            <TouchableOpacity onPress={() => openViewModal(item)}>
                <Text style={{ marginRight: 16 }}>👁</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openEditModal(item)}>
                <Text>✏️</Text>
            </TouchableOpacity>
        </View>
    </View>
);


const MasterScreen = ({ route, navigation }) => {
    const { type } = route.params;
    // const config = MASTER_CONFIG[type];
    const config = {
        ...MASTER_CONFIG[type],
        columns: MASTER_CONFIG[type]?.columns ?? [],
    };

    if (!config) {
        return <Text>Invalid Master Type</Text>;
    }
    const [visible, setVisible] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [mode, setMode] = useState('edit'); // edit | add | view
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);


    const openEditModal = item => {
        setEditItem(item);
        setMode('edit');
        setVisible(true);
    };

    const openViewModal = item => {
        setEditItem(item);
        setMode('view');
        setVisible(true);
    };

    const openAddModal = () => {
        setEditItem(null);
        setMode('add');
        setVisible(true);
    };


    // 🔥 SET HEADER TITLE
    useLayoutEffect(() => {
        navigation.setOptions({
            title: config.title,
        });
    }, [navigation, config.title]);


    const filteredData = useMemo(() => {
        if (!search.trim()) return data;
        if (!config.columns?.length) return data;

        const q = search.toLowerCase();

        return data.filter(item =>
            config.columns.some(col => {
                const value = item[col.key];
                return (
                    value &&
                    value.toString().toLowerCase().includes(q)
                );
            })
        );
    }, [search, data, config.columns]);

    const fetchApi = async (url, fallback = []) => {
        try {
            const res = await api.get(url);
            console.log(res?.data?.data?.content, 'res?.data?.data?.contentres?.data?.data?.content')
            return res?.data?.data?.content ?? res?.data?.data ?? fallback;
        } catch (e) {
            console.log(`API Error → ${url}`, e);
            return fallback;
        }
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        setSearch(''); // 🔥 reset search
        const response = await fetchApi(config.api.list, []);
        const finalData = config.transform
            ? response.map(config.transform)
            : response;

        setData(finalData);
        setLoading(false);
    }, [config.api.list]);


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const renderItem = useCallback(
        ({ item }) =>
            config.layout === 'card'
                ? renderCard(item, config, openEditModal, openViewModal)
                : renderRow(item, config, openEditModal, openViewModal),
        [config, openEditModal, openViewModal]
    );

    const closeModal = () => {
        setVisible(false);
        setEditItem(null);
        setMode('edit');
    };


    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>

            {/* 🔍 Search + Add Row */}
            <View
                style={{
                    padding: 16,
                    backgroundColor: '#FFFFFF',
                    borderBottomWidth: 1,
                    borderColor: '#E2E8F0',
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#F1F5F9',
                        borderRadius: 10,
                        paddingHorizontal: 12,
                        marginBottom: 12,
                    }}
                >
                    <Text style={{ marginRight: 8 }}>🔍</Text>

                    <TextInput
                        placeholder={`Search ${config.title}`}
                        value={search}
                        onChangeText={setSearch}
                        style={{
                            flex: 1,
                            paddingVertical: 10,
                            color: '#0F172A',
                        }}
                        placeholderTextColor="#64748B"
                    />
                </View>

                <TouchableOpacity
                    onPress={openAddModal}
                    style={{
                        backgroundColor: '#2563EB',
                        paddingVertical: 12,
                        borderRadius: 10,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>
                        + Add {config.title}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* 📋 List Section */}
            <View style={{ flex: 1, padding: 16 }}>
                {config.layout !== 'card' && (
                    <View
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 12,
                            paddingHorizontal: 12,
                            paddingTop: 8,
                            marginBottom: 8,
                        }}
                    >
                        <TableHeader columns={config.columns} />
                    </View>
                )}

                <FlatList
                    data={filteredData}
                    keyExtractor={(item, index) =>
                        item[config.primaryKey]
                            ? item[config.primaryKey].toString()
                            : index.toString()
                    }
                    renderItem={renderItem}
                    refreshing={loading}
                    onRefresh={fetchData}
                    contentContainerStyle={{
                        paddingBottom: 24,
                    }}
                    ListEmptyComponent={
                        !loading && (
                            <View
                                style={{
                                    alignItems: 'center',
                                    marginTop: 80,
                                }}
                            >
                                <Text style={{ fontSize: 40 }}>📭</Text>
                                <Text
                                    style={{
                                        marginTop: 12,
                                        color: '#64748B',
                                        fontSize: 16,
                                    }}
                                >
                                    No records found
                                </Text>
                            </View>
                        )
                    }
                />
            </View>

            {/* 🧾 Modal */}
            <MasterFormModal
                visible={visible}
                mode={mode}
                onClose={closeModal}
                onSuccess={fetchData}
                config={config}
                data={editItem}
            />
        </View>
    );

};

export default memo(MasterScreen);
