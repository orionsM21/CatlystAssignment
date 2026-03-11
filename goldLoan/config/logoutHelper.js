import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout, logoutOnly } from '../redux/moduleSlice';

export const fullLogout = async (dispatch, navigation) => {
  await AsyncStorage.multiRemove([
    '@token',
    '@userId',
    '@userName',
    '@roleCode',
    '@userProfile',
    '@selectedModule',
    '@isLoggedIn',
  ]);

  dispatch(logout());

  // 🔑 RESET ON ROOT NAVIGATOR
  navigation.getParent()?.reset({
    index: 0,
    routes: [{ name: 'ModuleSelector' }],
  });
};

export const sessionLogoutOnly = async (dispatch, navigation) => {
  const selectedModule = await AsyncStorage.getItem('@selectedModule');

  await AsyncStorage.multiRemove([
    '@token',
    '@userId',
    '@userName',
    '@roleCode',
    '@userProfile',
  ]);

  dispatch(logoutOnly());

  const loginRouteMap = {
    collection: 'CollectionFlow',
    los: 'LOSFlow',
    gold: 'GoldFlow',
    vehicle: 'VehicleFlow',
    payment: 'PaymentFlow',
    chat: 'ChatFlow',
  };

  navigation.getParent()?.reset({
    index: 0,
    routes: [
      {
        name: loginRouteMap[selectedModule] || 'ModuleSelector',
      },
    ],
  });
};
