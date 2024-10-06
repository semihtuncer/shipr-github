import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ShipPage from "../pages/ShipPage";
import ChatPage from "../pages/ChatPage";
import PersonalPage from "../pages/PersonalPage";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as SystemUI from "expo-system-ui";
import { UserContext } from "../context/userContext";

SystemUI.setBackgroundColorAsync("#080b10");
const Tab = createMaterialTopTabNavigator();
const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    borderRadius: 40,
    height: 70,
    bottom: 50,
    left: 80,
    right: 80,
    backgroundColor: "#212328",
  },
  tabBarIndicatorStyle: {
    backgroundColor: "#ff85ea",
    height: 6,
    position: "absolute",
    width: 35,
    left: 28,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  tabBarShowIcon: true,
  tabBarItemStyle: {},
  tabBarContentContainerStyle: {
    height: 70,
  },
  tabBarIconStyle: {
    width: 50,
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default function MainStack() {
  const { swipeOnShip } = useContext(UserContext);
  return (
    <Tab.Navigator screenOptions={screenOptions} initialRouteName="Ship">
      <Tab.Screen
        name="Personal"
        component={PersonalPage}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5
              name={focused ? "user-alt" : "user-alt"}
              color={focused ? "#ffffff" : "#585a5e"}
              size={focused ? 24 : 21}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Ship"
        component={ShipPage}
        options={{
          swipeEnabled: swipeOnShip,
          tabBarIcon: ({ focused, color, size }) => (
            <Octicons
              name={focused ? "arrow-switch" : "arrow-switch"}
              color={focused ? "#ffffff" : "#585a5e"}
              size={focused ? 32 : 27}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatPage}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "chatbubble" : "chatbubble"}
              color={focused ? "#ffffff" : "#585a5e"}
              size={focused ? 28 : 23}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
