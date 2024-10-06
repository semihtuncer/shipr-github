import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogInStack from "./stacks/LogInStack";
import MainStack from "./stacks/MainStack";
import { UserContextProvider } from "./context/userContext";

SystemUI.setBackgroundColorAsync("#080b10");
const Tab = createNativeStackNavigator();
const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
};

export default function App() {
  return (
    <UserContextProvider>
      <NavigationContainer>
        <StatusBar style="light" animated />
        <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen
            name="LogInStack"
            component={LogInStack}
            options={{ gestureEnabled: false }}
          />
          <Tab.Screen
            name="MainStack"
            component={MainStack}
            options={{ gestureEnabled: false }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </UserContextProvider>
  );
}
