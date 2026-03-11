import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator, StyleSheet
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
const OtpModal = ({
  visible,
  modalType,               // 'applicant' | 'coApplicant' | 'guarantor'
  otpApplicant,
  otpCoApplicant,
  otpGurantor,
  otpInputs,
  handleOtpChange,
  handleVerifyOtp,
  onOtpSuccess,            // 🔥 NEW
  isOtpFilled,
  isLoading,
  isVerifyingOtpApplicant,
  isVerifyingOtpCoApplicant,
  isVerifyingOtpGurantor,
  onClose,
  // styles,
}) => {
  const title =
    modalType === "applicant"
      ? "OTP Verification Applicant"
      : modalType === "coApplicant"
        ? "OTP Verification Co-Applicant"
        : "OTP Verification Guarantor";

  const currentOtp =
    modalType === "applicant"
      ? otpApplicant
      : modalType === "coApplicant"
        ? otpCoApplicant
        : otpGurantor;

  const isVerifying =
    modalType === "applicant"
      ? isVerifyingOtpApplicant
      : modalType === "coApplicant"
        ? isVerifyingOtpCoApplicant
        : isVerifyingOtpGurantor;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>

          {/* TITLE */}
          <Text style={styles.label}>{title}</Text>

          {/* OTP INPUTS */}
          <View style={styles.inputContainergg}>
            <View style={styles.otpBoxContainer}>
              {[0, 1, 2, 3].map((index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  placeholder="0"
                  placeholderTextColor="#A9A9A9"
                  value={currentOtp[index]}
                  keyboardType="numeric"
                  maxLength={1}
                  onChangeText={(text) =>
                    handleOtpChange(text, modalType, index)
                  }
                  onKeyPress={({ nativeEvent }) => {
                    if (
                      nativeEvent.key === "Backspace" &&
                      currentOtp[index] === "" &&
                      index > 0
                    ) {
                      otpInputs.current[index - 1]?.focus();
                    }
                  }}
                  ref={(ref) => (otpInputs.current[index] = ref)}
                />
              ))}
            </View>
          </View>

          {/* ACTIONS */}
          <View style={styles.buttonContainer}>
            {/* {isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : ( */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (isVerifying) &&
                  styles.disabledButton,
                ]}
                disabled={isVerifying}
                onPress={() =>
                  handleVerifyOtp(modalType, onOtpSuccess) // 🔥 PASS CALLBACK
                }
              >
                {isVerifying ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitText}>Verify</Text>
                )}
              </TouchableOpacity>
            {/* )} */}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};



const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(16),
    elevation: 10,
  },

  label: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
    marginBottom: verticalScale(20),
  },

  inputContainergg: {
    alignItems: "center",
    marginBottom: verticalScale(20),
  },

  otpBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
  },

  otpInput: {
    width: scale(50),
    height: verticalScale(50),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: "#D0D0D0",
    textAlign: "center",
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#000",
    backgroundColor: "#F9F9F9",
  },

  buttonContainer: {
    marginTop: verticalScale(10),
  },

  submitButton: {
    backgroundColor: "#2563EB", // 🔵 modern blue
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
  },

  disabledButton: {
    backgroundColor: "#9CA3AF",
  },

  submitText: {
    color: "#FFFFFF",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },

  closeButton: {
    marginTop: verticalScale(12),
    alignItems: "center",
  },

  closeText: {
    fontSize: moderateScale(14),
    color: "#EF4444",
    fontWeight: "500",
  },
});

export default React.memo(OtpModal);