import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Dashboard from './goldLoan/screens/Dashboard';
import Dashboard from './goldLoan/screens/Dashboard';
import CustomerList from './goldLoan/screens/CustomerList';
import Profile from './goldLoan/screens/Profile';
import NewLoan from './goldLoan/screens/NewLoan';
import CustomerDetails from './goldLoan/components/CustomerDetails';
import MasterScreen from './goldLoan/admin/components/MasterScreen';
import Reports from './goldLoan/screens/Reports';
import MasterReportScreen from './goldLoan/components/MasterReportScreen';
import { NavigationContainer } from '@react-navigation/native';
import GoldLogin from './goldLoan/screens/GoldLogin';
import AuthLoadingScreen from './goldLoan/AuthLogin';
import DashboardScreen from './goldLoan/screens/Dashboard/DashboardScreen';
import History from './goldLoan/screens/History';
const Stack = createNativeStackNavigator();
export default function GoldLoanNavigator() {
    return (
        <>

            <Stack.Navigator initialRouteName='AuthLogin' screenOptions={{ headerShown: false }}>
                <Stack.Screen name="AuthLogin" component={AuthLoadingScreen} />
                <Stack.Screen name="Login" component={GoldLogin} />
                <Stack.Screen name="Dashboard" component={DashboardScreen} />
                <Stack.Screen name="Customers" component={CustomerList} options={{ headerShown: true }} />
                <Stack.Screen name="NewLoan" component={NewLoan} options={{ headerShown: true }} />
                <Stack.Screen name="Profile" component={Profile} options={{ headerShown: true }} />
                <Stack.Screen name="CustomerDetails" component={CustomerDetails} options={{ headerShown: true }} />
                <Stack.Screen name="MasterScreen" component={MasterScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Report" component={Reports} options={{ headerShown: true }} />
                  <Stack.Screen name="History" component={History} options={{ headerShown: true }} />
                <Stack.Screen name="MasterReport" component={MasterReportScreen} options={{ headerShown: true }} />
            </Stack.Navigator>

        </>
    );
}




