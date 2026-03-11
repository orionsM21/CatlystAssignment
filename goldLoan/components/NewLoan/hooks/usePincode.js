import { useCallback, useState } from 'react';

export function usePincode(api) {
  const [pincodes, setPincodes] = useState([]);
  const [addressByRole, setAddressByRole] = useState({});

  const fetchPincodes = useCallback(async () => {
    const res = await api.get('/getAllPincodes');
    setPincodes(res.data?.data?.content || []);
  }, [api]);

  const fetchAddress = useCallback(
    async (pincode, role) => {
      if (!pincode) return;
      const res = await api.get(
        `/findAreaNameCityStateRegionZoneCountryByPincode/${pincode}`
      );

      setAddressByRole(prev => ({
        ...prev,
        [role]: res.data?.data,
      }));
    },
    [api]
  );

  return {
    pincodes,
    addressByRole,
    fetchPincodes,
    fetchAddress,
  };
}
