import React, { useState, useEffect } from "react"
import { View, Image, Alert, StyleSheet, ScrollView } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Button, Text, IconButton } from "react-native-paper"
import datetime from "react-native-date-picker"
import DatePicker from "react-native-date-picker"
import firestore from "@react-native-firebase/firestore"
import { useMyContextProvider } from "../index"
import Appointments from "./Appointments"
import { useCart } from "../routers/CartContext"
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const Appointment = ({navigation, route }) => {
    const { service } = route.params || {};
    const [open, setOpen] = useState(false)
    const [controller, dispatch] = useMyContextProvider()
    const {userLogin} = controller
    const APPOINTMENTs = firestore().collection("Appointments")
    const { addToCart } = useCart();
    

    const handleSubmit = () =>{
        
        const newId = userLogin.email + userLogin.phone ; // Tạo giá trị id mi

        
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
    //ham hien thi gia tien
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    return (
        <View style={styles.container}>
            <ScrollView style={styles.contentContainer}>
                <View style={styles.serviceCard}>
                    <Text style={styles.serviceTitle}>Tên sản phẩm</Text>
                    <Text style={styles.serviceName}>{service?.title}</Text>

                    <View style={styles.priceSection}>
                        <Text style={styles.priceLabel}>Giá sản phẩm</Text>
                        <Text style={styles.price}>{formatPrice(service?.price)} vnđ</Text>
                    </View>

                    {service?.image && (
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: service.image }}
                                style={styles.image}
                            />
                        </View>
                    )}

                    <TouchableOpacity 
                        style={styles.addToCartButton}
                        onPress={handleAddToCart}
                    >
                        <View style={styles.buttonContent}>
                            
                            <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    contentContainer: {
        padding: 24,
    },
    serviceCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#CCCCCC',
    },
    serviceTitle: {
        fontSize: 18,
        color: '#424242',
        marginBottom: 8,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    serviceName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    priceSection: {
        marginBottom: 20,
    },
    priceLabel: {
        fontSize: 15,
        color: '#757575',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FF6B00',
    },
    imageContainer: {
        width: '100%',
        height: 280,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        marginBottom: 28,
        elevation: 8,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        backgroundColor: '#FFFFFF',
    },
    addToCartButton: {
        backgroundColor: '#FF9800',
        borderRadius: 16,
        paddingVertical: 18,
        shadowColor: "#FF9800",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonIcon: {
        marginRight: 12,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    }
});

export default Appointment;
