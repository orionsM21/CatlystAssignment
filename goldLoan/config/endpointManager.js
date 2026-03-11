import AsyncStorage from '@react-native-async-storage/async-storage';

const getKey = module => `@BASE_URL_${module.toUpperCase()}`;

export const DEFAULT_ENDPOINTS = {
    gold: 'http://192.168.1.174:9093/api/v1/',
    // gold: `http://110.227.248.230:8593/goFinGoldLoanLosBE/api/v1/`,
    los: 'http://110.227.248.230:5567/afplLosSecureBE/api/v1/',
    collection: 'http://110.227.248.290:5555/collectionBE/v1/collections/',
    vehicle: 'http://110.227.248.230:5555/vehicleBE/api/v1/',
    payment: 'http://110.227.248.230:5555/paymentBE/api/v1/',
    chat: 'http://110.227.248.230:5555/chatBE/api/v1/',
};

export const getBaseUrl = async module => {
    try {
        const stored = await AsyncStorage.getItem(getKey(module));
        return stored || DEFAULT_ENDPOINTS[module];
    } catch (e) {
        return DEFAULT_ENDPOINTS[module];
    }
};

export const setBaseUrl = async (module, url) => {
    if (!url || !url.startsWith('http')) {
        throw new Error('Invalid BASE URL');
    }
    await AsyncStorage.setItem(getKey(module), url);
};
