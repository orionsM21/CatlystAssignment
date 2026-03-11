import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Modal,
    ScrollView,
    ActivityIndicator
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import createApiClient from "../common/hooks/apiClient";

const api = createApiClient("gold");

const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
};

const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case "completed":
            return "#2ecc71";
        case "open":
            return "#f39c12";
        case "rejected":
            return "#e74c3c";
        default:
            return "#7f8c8d";
    }
};

const LeadCard = React.memo(({ item, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
            <Text style={styles.cardName}>
                {item.firstName} {item.lastName}
            </Text>

            <Text style={styles.cardSub}>Application : {item.leadId}</Text>

            <View style={styles.badgeRow}>
                <View style={styles.productBadge}>
                    <Text style={styles.badgeText}>{item.productName}</Text>
                </View>

                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(item.status) }
                    ]}
                >
                    <Text style={[styles.badgeText, { color: '#fff' }]}>{item.status}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
});

const DetailItem = ({ label, value }) => (
    <View style={styles.detailBox}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value ?? "N/A"}</Text>
    </View>
);

const LeadHeader = ({ lead }) => {
    return (
        <View style={styles.leadHeader}>
            <Text style={styles.leadName}>
                {lead.firstName} {lead.lastName}
            </Text>

            <Text style={styles.leadId}>{lead.leadId}</Text>

            <View style={styles.badgeRow}>
                <View style={styles.productBadge}>
                    <Text style={styles.badgeText}>{lead.productName}</Text>
                </View>

                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(lead.status) }
                    ]}
                >

                    <Text style={[styles.badgeText, { color: '#fff' }]}>{lead.status}</Text>
                </View>
            </View>
        </View>
    );
};

const LeadDetailsGrid = ({ lead }) => {
    return (
        <View style={styles.grid}>
            <DetailItem label="Branch" value={lead.branchName} />
            <DetailItem label="Portfolio" value={lead.portfolioDescription} />
            <DetailItem label="Stage" value={lead.stage} />
            <DetailItem label="Status" value={lead.status} />
        </View>
    );
};

const LogsTableHeader = () => (
    <View style={[styles.tableRow, styles.tableHeader]}>
        {/* <Text style={styles.headerCell}>ID</Text> */}
        <Text style={styles.headerCell}>Application</Text>
        <Text style={styles.headerWrapCell}>Stage</Text>
        <Text style={styles.headerCell}>Status</Text>
        <Text style={styles.headerCell}>User</Text>
        <Text style={styles.headerCell}>Type</Text>
        <Text style={styles.headerWrapCell}>Description</Text>
        <Text style={styles.headerCell}>Created</Text>
        <Text style={styles.headerCell}>Modified</Text>
    </View>
);

const LogsTableRow = React.memo(({ log }) => {
    return (
        <View style={styles.tableRow}>
            {/* <Text style={styles.cell}>{log.id}</Text> */}
            <Text style={styles.cell}>{log.applicationNumber}</Text>
            <Text style={styles.wrapCell}>{log.stage}</Text>
            <Text style={styles.cell}>{log.status}</Text>
            <Text style={styles.cell}>{log.user}</Text>
            <Text style={styles.cell}>{log.type}</Text>
            <Text style={styles.wrapCell}>{log.description} </Text>
            <Text style={styles.cell}> {formatDate(log.createdTime)} </Text>
            <Text style={styles.cell}> {formatDate(log.lastModifiedTime)} </Text>
        </View>
    );
});

export default function History() {
    const [leads, setLeads] = useState([]);
    const [logs, setLogs] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getAllLeads();
    }, []);

    const getAllLeads = async () => {
        try {
            const res = await api.get("getAllApplication");

            const normalized = res?.data?.data?.map((lead) => {
                const applicant = lead?.applicant?.find(
                    (a) => a.applicantTypeCode === "Applicant"
                );

                const profile = applicant?.consumptionApplicant ?? {};

                return {
                    id: lead.id,
                    leadId: lead.applicationNo,
                    portfolioDescription: lead?.portfolioDescription,
                    productName: lead.productName,
                    stage: lead.stage,
                    status: lead.status,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    branchName: lead?.branchName
                };
            });

            setLeads(normalized);
        } catch (e) {
            console.log(e);
        }
    };

    const getLogs = async (applicationNumber) => {
        try {
            setLoadingLogs(true);

            const res = await api.get(
                `getLogsDetailsByApplicationNumber/${applicationNumber}`
            );

            setLogs(res?.data?.data ?? []);
        } catch (e) {
            console.log(e);
        } finally {
            setLoadingLogs(false);
        }
    };

    const handleCardPress = useCallback((lead) => {
        setSelectedLead(lead);
        getLogs(lead.leadId);
    }, []);

    const closeModal = () => {
        setSelectedLead(null);
        setLogs([]);
    };

    const filteredLeads = useMemo(() => {
        if (!search) return leads;

        const q = search.toLowerCase();

        return leads.filter((l) =>
            [l.firstName, l.lastName, l.leadId]
                .join(" ")
                .toLowerCase()
                .includes(q)
        );
    }, [search, leads]);

    const renderItem = useCallback(
        ({ item }) => <LeadCard item={item} onPress={handleCardPress} />,
        [handleCardPress]
    );

    const sortedLogs = useMemo(() => {
        return [...logs].sort((a, b) => b.createdTime - a.createdTime);
    }, [logs]);

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search by name or application"
                placeholderTextColor='#888'
                style={styles.search}
                value={search}
                onChangeText={setSearch}
            />

            <FlatList
                data={filteredLeads}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                initialNumToRender={8}
                maxToRenderPerBatch={8}
                windowSize={5}
            />

            <Modal visible={!!selectedLead} animationType="slide">
                <View style={styles.modalContainer}>

                    <TouchableOpacity style={{ alignItems: 'flex-end', }} onPress={closeModal}>
                        <Text style={styles.close}>Close</Text>
                    </TouchableOpacity>

                    {selectedLead && (
                        <ScrollView>

                            <LeadHeader lead={selectedLead} />

                            <Text style={styles.sectionTitle}>Lead Details</Text>
                            <LeadDetailsGrid lead={selectedLead} />

                            <Text style={styles.sectionTitle}>Workflow Logs</Text>

                            {loadingLogs ? (
                                <ActivityIndicator size="large" />
                            ) : (
                                <ScrollView horizontal>

                                    <View>

                                        <LogsTableHeader />

                                        <FlatList
                                            data={sortedLogs}
                                            keyExtractor={(item) => item.id.toString()}
                                            renderItem={({ item }) => <LogsTableRow log={item} />}
                                        />

                                    </View>

                                </ScrollView>
                            )}

                        </ScrollView>
                    )}

                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({

    container: { flex: 1, padding: 16, backgroundColor: '#ffffff' },

    search: {
        backgroundColor: "#eee",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        color: '#000'
    },

    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 2
    },

    cardName: {
        fontSize: 16,
        fontWeight: "600",
        color: '#000'
    },

    cardSub: {
        color: "#666",
        marginTop: 4
    },

    badgeRow: {
        flexDirection: "row",
        marginTop: 8
    },

    productBadge: {
        backgroundColor: "#ddd",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        marginRight: 10
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20
    },

    badgeText: {
        color: "#000",
        fontSize: 12,
        fontWeight: '500'
    },

    leadHeader: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        elevation: 3,
        marginBottom: 15
    },

    leadName: {
        fontSize: 20,
        fontWeight: "700"
    },

    leadId: {
        color: "#666",
        marginTop: 4
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },

    detailBox: {
        width: "48%",
        backgroundColor: "#f7f7f7",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10
    },

    detailLabel: {
        fontSize: 14,
        color: "#444",
        fontWeight: "600",
    },

    detailValue: {
        fontWeight: "600",
        marginTop: 4,
        color: '#666'
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginVertical: 10,
        color: '#000'
    },

    tableHeader: {
        backgroundColor: "#ececec"
    },

    tableRow: {
        flexDirection: "row",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#eee"
    },

    headerCell: {
        width: 120,
        fontWeight: "700",
        fontSize: 12,
        color: '#555'
    },

    headerWrapCell: {
        width: 180,
        fontWeight: "700",
        fontSize: 12,
        color: '#555'
    },

    cell: {
        width: 120,
        fontSize: 12,
        flexShrink: 1,
        color: '#777'
    },

    wrapCell: {
        width: 180,
        fontSize: 12,
        flexShrink: 1,
        flexWrap: "wrap",
        color: '#777'
    },

    modalContainer: {
        flex: 1,
        padding: 20
    },

    close: {
        color: "red",
        marginBottom: 10
    }

});