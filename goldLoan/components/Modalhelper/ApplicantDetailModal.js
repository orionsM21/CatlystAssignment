import React, { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from "react-native";

const ApplicantDetailModal = ({
    visible,
    selectedCoApplicant,
    renderTabContent,
    onClose,
    styles,
}) => {
    const [activeTabView, setActiveTabView] = useState("Applicant");

    // Reset tab when modal opens
    useEffect(() => {
        if (visible) {
            setActiveTabView("Applicant");
        }
    }, [visible]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}   // ✅ Android back
        >
            <View style={styles.modalContainerdetail}>
                <View style={styles.modalContentdetail}>

                    {/* ===== TABS ===== */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[
                                styles.tab,
                                activeTabView === "Applicant" && styles.activeTab,
                            ]}
                            onPress={() => setActiveTabView("Applicant")}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTabView === "Applicant" && styles.activeTabText,
                                ]}
                            >
                                Applicant
                            </Text>
                        </TouchableOpacity>

                        {selectedCoApplicant &&
                            Object.keys(selectedCoApplicant).length > 0 && (
                                <TouchableOpacity
                                    style={[
                                        styles.tab,
                                        activeTabView === "Co-Applicant" && styles.activeTab,
                                    ]}
                                    onPress={() => setActiveTabView("Co-Applicant")}
                                >
                                    <Text
                                        style={[
                                            styles.tabText,
                                            activeTabView === "Co-Applicant" &&
                                            styles.activeTabText,
                                        ]}
                                    >
                                        Co-Applicant
                                    </Text>
                                </TouchableOpacity>
                            )}
                    </View>

                    {/* ===== TAB CONTENT ===== */}
                    <ScrollView>
                        {renderTabContent(activeTabView)}

                        {/* FOOTER */}
                        <View
                            style={{
                                marginVertical: 5,
                                marginBottom: 35,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={onClose}
                            >
                                <Text style={styles.closeText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                </View>
            </View>
        </Modal>
    );
};

export default React.memo(ApplicantDetailModal);
