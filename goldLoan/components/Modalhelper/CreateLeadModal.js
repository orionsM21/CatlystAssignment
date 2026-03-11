import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const LEAD_TO_FORM_MAP = {
  Applicant: {
    firstName: "firstName",
    lastName: "lastName",
    email: "email",
    mobileNo: "mobile",
    pan: "pan",
    gender: "gender",
    dateOfBirth: "dob",
    loanAmount: "loanAmount",
  },
};

const CreateLeadModal = ({
  visible,
  selectedLead,
  onSubmit,
  onClose,
  renderContent,
  canSubmitLead,
  formDatafilled,
  renderedTabs
  // styles
}) => {

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Customer Onboarding</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* WARNING */}
            {/* {!canSubmitLead && (
              <Text style={styles.warningText}>
                Please verify Applicant, Co-Applicant & Guarantor
              </Text>
            )} */}


            <View style={styles.tabsWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsContent}
              >
                {renderedTabs}
              </ScrollView>
            </View>
            {/* 🔥 CONTENT (THIS WAS MISSING) */}
            <ScrollView
              style={styles.contentContainer}
              contentContainerStyle={{ paddingBottom: verticalScale(120) }}
              showsVerticalScrollIndicator={false}
            >
              {typeof renderContent === "function"
                ? renderContent()
                : renderContent}
            </ScrollView>

            {/* 🔥 SINGLE STICKY FOOTER */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  !canSubmitLead && styles.submitBtnDisabled,
                ]}
                disabled={!canSubmitLead}
                onPress={onSubmit}
              >
                <Text style={styles.submitText}>Submit Lead</Text>
              </TouchableOpacity>
            </View>
          </View>

        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default React.memo(CreateLeadModal);

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: "#eee"
  },

  safe: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "#E4E4E4",
    margin: scale(8),
    borderRadius: moderateScale(12),
    overflow: "hidden",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(6),
    backgroundColor: "#2563EB",
  },

  modalTitle: {
    color: "#FFF",
    fontSize: moderateScale(18),
    fontWeight: "600",
  },

  closeBtn: {
    padding: scale(6),
  },

  closeIcon: {
    color: "#FFF",
    fontSize: moderateScale(20),
    fontWeight: "600",
  },

  warningText: {
    textAlign: "center",
    color: "#B91C1C",
    fontSize: moderateScale(13),
    marginVertical: verticalScale(8),
    backgroundColor: "#FEE2E2",
    paddingVertical: verticalScale(6),
    marginHorizontal: scale(12),
    borderRadius: moderateScale(6),
  },


  tabsRow: {
    paddingHorizontal: scale(10),
    marginBottom: verticalScale(6),
  },

  contentContainer: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: scale(12),
  },

  submitBtn: {
    backgroundColor: "#16A34A", // green
    paddingVertical: verticalScale(14),
    alignItems: "center",
  },

  submitBtnDisabled: {
    backgroundColor: "#9CA3AF",
  },

  submitText: {
    color: "#FFF",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },
  mainTabsRow: {
    flexGrow: 0,
    backgroundColor: "#F8F5F5",
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: verticalScale(6),
  },
  tabsWrapper: {
    height: 48,                // fixed tab height
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },

  tabsContent: {
    alignItems: "center",      // prevent vertical stretch
    paddingHorizontal: 12,
  },
});
