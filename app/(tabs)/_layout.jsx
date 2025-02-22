import { Tabs } from "expo-router";
import React from "react";


const Layout = () => {
  return (
    <Tabs 
      screenOptions={{
        headerShown:false,
        tabBarStyle: { display: "none" }, 
      }}
    >
    </Tabs>
    
  );
};

export default Layout;
