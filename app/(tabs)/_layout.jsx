import Colors from "../../constants/Colors";
import { Tabs } from "expo-router";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
// import AsyncStorage from '@react-native-async-storage/async-storage';


const Layout = () => {
  // const clearAsyncStorage = async () => {
  //   try {
  //     await AsyncStorage.clear();
  //     console.log('✅ AsyncStorage cleared!');
  //   } catch (error) {
  //     console.error('❌ Error clearing AsyncStorage:', error);
  //   }
  // };
  
  // // Call this function where needed
  // clearAsyncStorage();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rented"
        options={{
          tabBarLabel: "Rented List",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="watch"
        options={{
          tabBarLabel: "WatchScreen",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stopwatch-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
