import React, { useEffect } from 'react';
import { View, FlatList } from 'react-native';
import createApiClient from '../../common/hooks/apiClient';

import { useLeads } from './hooks/useLeads';
import { useOtp } from './hooks/useOtp';
import { usePincode } from './hooks/usePincode';
import { useTabs } from './hooks/useTabs';

const api = createApiClient('gold');

export default function NewLoanScreen() {
    const { leads, fetchLeadById } = useLeads(api);
    const { fetchPincodes } = usePincode(api);
    const { activeMain, activeSub } = useTabs();

    useEffect(() => {
        fetchPincodes();
    }, [fetchPincodes]);

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={leads}
                keyExtractor={(i) => String(i.id)}
                renderItem={({ item }) => null}
            />
        </View>
    );
}
