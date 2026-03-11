import React, { useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { saveUserDetails, saveToken } from './redux/actions';
import { BASE_URL } from './api/Endpoint';


const AuthLoadingScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // 🧩 Get stored token and username
        const token = await AsyncStorage.getItem('@token');
        const loggedInUserName = await AsyncStorage.getItem('@userName');

        // 🔄 Update Redux
        if (token) dispatch(saveToken(token));

        // 🚪 No token or username → Go to Login
        if (!token || !loggedInUserName) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          return;
        }

        // 🌐 Fetch user details
        const response = await axios.get(
          `${BASE_URL}getUserDetailByUserName/${loggedInUserName}`,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userDetailData = response?.data?.data;

        if (!userDetailData || response.data.msgKey !== 'Success') {
          throw new Error('Invalid user details received');
        }

        // 💾 Save roleCode for later use
        const roleCode = userDetailData.role?.[0]?.roleCode || '';
        await AsyncStorage.setItem('@roleCode', roleCode);

        // 💾 Save to Redux store
        dispatch(saveUserDetails(userDetailData));

        // 🧭 Navigate based on role
        navigation.navigate('Dashboard')
      } catch (error) {
        console.error('❌ Error fetching user details:', error.message);

        // 🧹 Clear possible corrupt data
        await AsyncStorage.clear();

        Alert.alert(
          'Session Expired',
          'Your session has expired or data is invalid. Please log in again.'
        );

        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    };

    checkAuthentication();
  }, [dispatch, navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
      <ActivityIndicator size="large" color="#0EA5E9" />
    </View>
  );
};

export default AuthLoadingScreen;
