import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { moderateScale, verticalScale } from "react-native-size-matters";

function QuickActions() {
  const navigation = useNavigation();

  return (
    <>
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.row}>
        <ActionButton
          title="Create Lead"
          onPress={() =>
            navigation.navigate("NewLoan", {
              triggerCreate: true,
            })
          }
        />

        <ActionButton
          title="Upload Docs"
          onPress={() => navigation.navigate("DocumentUpload")}
        />
      </View>
    </>
  );
}

const ActionButton = React.memo(({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
});

export default React.memo(QuickActions);

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    marginBottom: verticalScale(10),
    color: "#000",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
  },

  button: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: moderateScale(14),
    paddingVertical: verticalScale(14),
    alignItems: "center",
    elevation: 3,
  },

  buttonText: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#000",
  },
});