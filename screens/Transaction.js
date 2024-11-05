import React, { useState, useEffect } from "react";
import { View, FlatList,StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text,Card,Title,Paragraph,IconButton, Button } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { useMyContextProvider } from "../index";


const Transaction = ({navigation, route }) => {
    const [appointments, setAppointments] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc'); // 'desc' for newest first, 'asc' for oldest first
    const [controller, dispatch] = useMyContextProvider();
    const { userLogin } = controller;
    const [services, setServices] = useState([]);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('Appointments')
            .where('email', '==', userLogin.email)
            .where('state', '==', 'complete')  // Only fetch 'new' appointments
            .onSnapshot(querySnapshot => {
                const appointmentsData = [];
                querySnapshot.forEach(documentSnapshot => {
                    appointmentsData.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                sortAppointments(appointmentsData);
            });
            
        return () => unsubscribe();
    }, []);
    
    const sortAppointments = (data) => {
        const sorted = data.sort((a, b) => {
            const dateA = a.datetime ? a.datetime.toDate() : new Date(0);
            const dateB = b.datetime ? b.datetime.toDate() : new Date(0);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
        setAppointments([...sorted]); // Create a new array to trigger re-render
    };

    const toggleSortOrder = () => {
        const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
        setSortOrder(newOrder);
        sortAppointments(appointments);
    };

    // show các lịch
    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <Title style={styles.text}>Mã xác nhận: {item.id}{item.id}</Title>
                <Paragraph style={styles.text}>Người đặt: {item.email}</Paragraph>
                <Paragraph style={styles.text}>Thời gian đặt: {item.datetime ? (() => {
                    const date = item.datetime.toDate();
                    const timeString = date.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    });
                    const dateString = date.toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    return `${timeString} | ${dateString}`;
                })() : 'Không xác định'}</Paragraph>
                    <Paragraph style={styles.text}>Sản phẩm: {item.service}</Paragraph>
                    <Paragraph style={styles.text}>Giá: {item.price} vnđ </Paragraph>
                    <Paragraph style={styles.text}>Liên hệ: {item.phone}</Paragraph>
                    <Paragraph style={styles.text}>Trạng thái: {item.state}</Paragraph>
            </Card.Content>
            
        </Card>
        
    );
    const handletransaction = () =>{
        navigation.navigate("Transaction")
    }
    return (
        <View style={{ flex: 1 , backgroundColor:"white"}}>
            
            <Button onPress={toggleSortOrder} style={styles.sortButton}>
                {sortOrder === 'desc' ? "Sắp xếp: Đơn mới nhất" : "Sắp xếp: Đơn cũ nhất "}
            </Button>
            <FlatList
                data={appointments}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 17, fontWeight: "bold"
    },
    card: {
        margin: 10,
        borderRadius: 8,
        elevation: 3,
        backgroundColor: '#66FF66',
    },
    sortButton: {
        margin: 10,
    },
});
export default Transaction;