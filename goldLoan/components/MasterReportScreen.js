import { ActivityIndicator, StyleSheet, View } from "react-native";
import React, { useEffect, useState, useCallback } from "react";


import DynamicReportRenderer from "./DynamicReportRenderer";
import createApiClient from "../common/hooks/apiClient";

const MasterReportScreen = ({ route }) => {
  const { applicationId, reportType } = route.params;
  const api = createApiClient("gold");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadReport = useCallback(async () => {
    try {
      const res = await api.get(`report/${reportType}/${applicationId}`);
      setData(res.data);
    } catch (e) {
      console.log("Report load failed", e);
    } finally {
      setLoading(false);
    }
  }, [applicationId, reportType]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <DynamicReportRenderer type={reportType} data={data} />;
};

export default MasterReportScreen;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
