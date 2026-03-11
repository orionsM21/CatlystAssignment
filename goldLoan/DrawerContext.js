import React, { createContext, useRef } from "react";
import { Animated } from "react-native";

export const DrawerContext = createContext();

export const DrawerProvider = ({ children }) => {
  const progress = useRef(new Animated.Value(0)).current;

  const openDrawer = () => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(progress, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  return (
    <DrawerContext.Provider value={{ progress, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
};