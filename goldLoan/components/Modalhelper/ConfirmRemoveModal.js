import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image, StyleSheet
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
const ConfirmRemoveModal = ({
  visible,
  file,
  onConfirm,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.confirmOverlay}>
        <View style={styles.confirmContainer}>

          {/* IMAGE PREVIEW */}
          {file?.type?.startsWith("image/") && file?.uri && (
            <Image
              source={{ uri: file.uri }}
              style={styles.confirmPreview}
              resizeMode="contain"
            />
          )}

          {/* MESSAGE */}
          <Text style={styles.confirmText}>
            Are you sure you want to remove this file?
          </Text>

          {/* ACTION BUTTONS */}
          <View style={styles.confirmActions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.removeBtn}
              onPress={onConfirm}
              activeOpacity={0.85}
            >
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default React.memo(ConfirmRemoveModal);
export const styles = StyleSheet.create({
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  confirmContainer: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(14),
    padding: scale(16),
    alignItems: "center",
  },

  confirmPreview: {
    width: "100%",
    height: verticalScale(160),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(12),
  },

  confirmText: {
    fontSize: moderateScale(15),
    color: "#111827",
    textAlign: "center",
    marginBottom: verticalScale(16),
    fontWeight: "500",
  },

  confirmActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  cancelBtn: {
    flex: 1,
    marginRight: scale(8),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
    backgroundColor: "#E5E7EB",
    alignItems: "center",
  },

  cancelText: {
    color: "#374151",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },

  removeBtn: {
    flex: 1,
    marginLeft: scale(8),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
    backgroundColor: "#EF4444",
    alignItems: "center",
  },

  removeText: {
    color: "#FFFFFF",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
});