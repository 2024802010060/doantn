import React, { useState, useEffect } from "react"
import { View, Image, Alert } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Button, Text, IconButton } from "react-native-paper"
import datetime from "react-native-date-picker"
import DatePicker from "react-native-date-picker"
import firestore from "@react-native-firebase/firestore"
import { useMyContextProvider } from "../index"
import Appointments from "./Appointments"
import { useCart } from "../routers/CartContext"

const Appointment = ({navigation, route }) => {
    const { service } = route.params || {};
    const [open, setOpen] = useState(false)
    const [controller, dispatch] = useMyContextProvider()
    const {userLogin} = controller
    const APPOINTMENTs = firestore().collection("Appointments")
    const { addToCart } = useCart();
    

    const handleSubmit = () =>{
        
        const newId = userLogin.email + userLogin.phone ; // Tạo giá trị id mới

        
        APPOINTMENTs
        .add({
            email: userLogin.email,
            service: service.title,
            price: service.price,
            phone: userLogin.phone,
            
            state: "new"
        })
        .then(r => 
            {
                APPOINTMENTs.doc(r.id).update({id: userLogin.email})
                navigation.navigate("Appointments")
            })
    }
      
    const handleAddToCart = () => {
        addToCart(service);
        Alert.alert(
            "Thành công",
            "Sản phẩm đã được thêm vào giỏ hàng",
            [{ text: "OK" }]
        );
    };

    return (
        <View style={{padding: 10, backgroundColor:"white", flex:1}}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tên dịch vụ: </Text>
                <Text style={{ fontSize: 20 }}>{service && service.title}</Text>
            </View>
            
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Giá: </Text>
                <Text style={{ fontSize: 20}}>{service && service.price} ₫</Text>
            </View>
            {service && service.image !== "" && (
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Ảnh: </Text>
                    <Image
                        source={{ uri: service && service.image }}
                        style={{ height: 300, width: '100%' }}
                        resizeMode="contain"
                    />
                </View>
            )}
            
            
            <Button 
                style={{margin: 10}} 
                textColor="black" 
                buttonColor="orange" 
                mode="contained" 
                onPress={handleAddToCart}>  
                Thêm vào giỏ hàng
            </Button>
            
        </View>
    )
}

export default Appointment;
