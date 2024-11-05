import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ServicesCustomer from '../screens/ServicesCustomer';
import { useMyContextProvider } from "../index";
import Appointment from "../screens/Appointment";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image, Text, TextInput} from "react-native";
import ChangePassword from "../screens/ChangePassword";
import Transaction from "../screens/Transaction";
import PaymentOptionsScreen from "../screens/PaymentZalo";
const Stack = createStackNavigator();

const RouterServiceCustomer = ({ navigation }) => {
    const [controller] = useMyContextProvider();
    const { userLogin } = controller;
    
    return (
        //đây là router của customer
        //thanh ở trên đầu của cus
        <Stack.Navigator
            initialRouteName="ServicesCustomer"
            screenOptions={{
                headerTitleAlign: "left",
                headerStyle: {
                    backgroundColor: "orange"
                },
                headerRight: (props) => (
                    <TouchableOpacity onPress={() => navigation.navigate("ProfileCustomer")}>
                      <Image source={require('../assets/account.png')} style={{ width: 30, height: 30, margin: 20 }} />
                    </TouchableOpacity>
                  ),
            }}>

            <Stack.Screen 
            name="ServicesCustomer" 
            component={ServicesCustomer} 
            
            options={{
                headerLeft: null, 
                
                title: (userLogin != null) && (userLogin.fullName),
                
            }} 
            />
            <Stack.Screen 
            name="Appointment" 
            component={Appointment} 
            options={{title:"Đặt hàng" }}/>
            
            
            
        </Stack.Navigator>
    )
}

export default RouterServiceCustomer;
