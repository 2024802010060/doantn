import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RouterServiceCustomer from "./RouterServiceCustomer";
import Appointments from "../screens/Appointments";
import ProfileCustomer from "../screens/ProfileCustomer";
import { Image } from "react-native";
import Cart from "../screens/Cart";
import ServicesCustomer from "../screens/ServicesCustomer";
import RouterProfile from "./RouterProfile";
import RouterAppointment from "./RouterAppointment";
import Map from "../screens/Map";
  const Tab = createBottomTabNavigator();
  //đây là thanh dưới của customer
  const color = "orange"
const Customer = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: { backgroundColor: 'white', height: 65 },
        tabBarPressColor: 'transparent',
        
      }}
      
    >
      <Tab.Screen
        name="RouterServiceCustomer"
        component={RouterServiceCustomer}
        options={{
          title: "Trang chủ",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/home.png")}
              style={{ width: 24, height: 24, tintColor: color }}
            />
            
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          title: "Giỏ hàng",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/iconcart.png")}
              style={{ width: 30, height: 24, tintColor: color }}
      />)}}
      />
      <Tab.Screen
        name="Map"
        component={Map}
        options={{
          title: "Map",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/map.png")}
              style={{ width: 30, height: 24, tintColor: color,resizeMode:"center" }}
      />)}}
      />
      <Tab.Screen
        name="RouterAppointment"
        component={RouterAppointment}
        options={{
          title: "Đơn hàng",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/appointment.png")}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      
      <Tab.Screen
        name="RouterProfile"
        component={RouterProfile}
        options={{
          title: "Hồ sơ",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/customer.png")}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Customer;
