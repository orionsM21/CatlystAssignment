import React from "react";
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

const PreviewFileModal = ({ visible, data, onClose }) => {

  const rawFile = data?.file;

  // Derive uri — handle both uri and base64
  const fileUri = rawFile?.uri
    ? rawFile.uri
    : rawFile?.base64
      ? `data:image/png;base64,${rawFile.base64}`
      : null;

  const isPdf = fileUri?.includes("application/pdf") ||
    rawFile?.type?.includes("pdf") ||
    rawFile?.Name?.toLowerCase().endsWith(".pdf");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {rawFile?.Name || rawFile?.imageType || "Preview File"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* PREVIEW */}
          <View style={styles.previewArea}>
            {fileUri && !isPdf ? (
              <Image
                source={{ uri: fileUri }}
                style={styles.previewImage}
                resizeMode="contain"
                onError={() => console.warn("Image load failed:", fileUri?.slice(0, 50))}
              />
            ) : fileUri && isPdf ? (
              <Text style={styles.previewErrorText}>
                📄 PDF preview not supported.{"\n"}Use the Share option to open it.
              </Text>
            ) : (
              <Text style={styles.previewErrorText}>
                Unable to preview this file
              </Text>
            )}
          </View>

          {/* FOOTER */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={styles.actionText}>Close</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default React.memo(PreviewFileModal);


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(14),
    overflow: "hidden",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: "#2563EB",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },

  closeBtn: {
    padding: scale(4),
  },

  closeIcon: {
    color: "#FFFFFF",
    fontSize: moderateScale(18),
    fontWeight: "600",
  },

  previewArea: {
    height: verticalScale(260),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: scale(12),
  },

  previewImage: {
    width: "100%",
    height: "100%",
  },

  previewErrorText: {
    fontSize: moderateScale(14),
    color: "#6B7280",
    textAlign: "center",
  },

  actionBtn: {
    backgroundColor: "#EF4444",
    paddingVertical: verticalScale(12),
    alignItems: "center",
  },

  actionText: {
    color: "#FFFFFF",
    fontSize: moderateScale(15),
    fontWeight: "600",
  },
});
