import { Alert, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import AppDropdown from '../admin/components/AppDropdown';
import { useNavigation } from '@react-navigation/native';
import createApiClient from '../common/hooks/apiClient';

const REPORT_OPTIONS = [
    { label: "Application Summary", value: 1 },
    { label: "KYC Report", value: 2 },
    { label: "Gold Valuation Report", value: 3 },
    { label: "Loan Sanction Report", value: 4 },
    { label: "Disbursal Report", value: 5 },
];
const Reports = () => {
    const api = createApiClient('gold');

    const [loading, setLoading] = useState(false);
    const [leads, setLeads] = useState([]);
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const navigation = useNavigation();
    // ================= FETCH =================
    const fetchLeads = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('getAllApplication');
            setLeads(res.data?.data || []);
        } catch (e) {
            Alert.alert('Error', 'Failed to fetch leads');
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        fetchLeads();
    }, []);

    // ================= TRANSFORM API → DROPDOWN =================
    const applicationOptions = useMemo(() => {
        return leads.map(item => ({
            label: item.applicationNo, // what user sees
            value: item.id,           // internal id
        }));
    }, [leads]);
    const handleGenerate = async () => {
        if (!selectedAppId || !selectedReport) return;

        try {
            setLoading(true);

            const payload = {
                applicationId: selectedAppId,
                reportType: selectedReport,
            };

            console.log("Payload:", payload);

            // Example API (adjust endpoint)
            const res = await api.post("generateReport", payload);

            Alert.alert("Success", "Report generated");
            navigation.navigate("MasterReport", {
                applicationId: selectedAppId,
                reportType: selectedReport,
            });

        } catch (e) {
            Alert.alert("Error", "Failed to generate report");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reports</Text>

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <>
                    {/* APPLICATION DROPDOWN */}
                    <AppDropdown
                        label="Select Application"
                        data={applicationOptions}
                        value={selectedAppId}
                        placeholder="Select Application No"
                        onChange={val => {
                            setSelectedAppId(val);
                            console.log("Selected Application:", val);
                        }}
                    // full
                    />

                    {/* REPORT TYPE DROPDOWN */}
                    <AppDropdown
                        label="Select Report"
                        options={REPORT_OPTIONS}
                        value={selectedReport}
                        placeholder="Select Report Type"
                        onChange={val => {
                            setSelectedReport(val);
                            console.log("Selected Report:", val);
                        }}
                    // full
                    />

                    <TouchableOpacity
                        style={[
                            styles.generateBtn,
                            !(selectedAppId && selectedReport) && styles.disabledBtn,
                        ]}
                        disabled={!(selectedAppId && selectedReport)}
                        onPress={() => handleGenerate()}
                    >
                        <Text style={styles.generateText}>Generate Report</Text>
                    </TouchableOpacity>

                </>
            )}
        </View>
    );
};

export default Reports;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    generateBtn: {
        marginTop: 24,
        backgroundColor: "#2563EB",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },

    generateText: {
        color: "#fff",
        fontWeight: "700",
    },

    disabledBtn: {
        backgroundColor: "#CBD5E1",
    },

});
