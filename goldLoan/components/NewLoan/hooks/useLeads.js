import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useLeads(api) {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/getAllApplication');
      setLeads(res.data?.data || []);
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [api]);

  const fetchLeadById = useCallback(
    async (id) => {
      try {
        const res = await api.get(`/getApplicationById/${id}`);
        setSelectedLead(res.data?.data);
      } catch (e) {
        Alert.alert('Error', 'Failed to fetch lead');
      }
    },
    [api]
  );

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    selectedLead,
    setSelectedLead,
    fetchLeadById,
    loading,
    refresh: fetchLeads,
  };
}
