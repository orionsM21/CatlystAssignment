import 'react-native-gesture-handler';
import React from "react";
import { StatusBar } from "react-native";

import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import GoldLoanNavigator from "./GoldLoanNavigator";
import { DrawerProvider } from "./goldLoan/DrawerContext";
import DrawerLayout from "./goldLoan/DrawerLayout";
import store from "./goldLoan/redux/store";

export default function App() {

  return (
    <Provider store={store}>
      <SafeAreaProvider>

        <NavigationContainer>

          <DrawerProvider>
            <DrawerLayout>

              <StatusBar
                backgroundColor="#0B1220"
                barStyle="light-content"
              />

              <GoldLoanNavigator />

            </DrawerLayout>
          </DrawerProvider>

        </NavigationContainer>

      </SafeAreaProvider>
    </Provider>
  );
}