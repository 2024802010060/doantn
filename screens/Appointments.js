import React, { useState, useEffect } from "react";
import { View, FlatList,StyleSheet } from "react-native";
import { Text,Card,Title,Paragraph,IconButton, Button } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { useMyContextProvider } from "../index";
import { useNavigation } from '@react-navigation/native'; // Thêm import này


const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [services, setServices] = useState([]); // State để lưu dịch vụ
    const [controller] = useMyContextProvider();
    const { userLogin } = controller;
    const navigation = useNavigation(); // Khởi tạo navigation

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('Appointments')
            .where('email', '==', userLogin.email)
            .where('state', '==', 'new')
            .onSnapshot(querySnapshot => {
                const appointmentsData = [];
                querySnapshot.forEach(documentSnapshot => {
                    appointmentsData.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });

                // Sắp xếp theo thời gian, đơn hàng mới nhất ở trên cùng
                appointmentsData.sort((a, b) => b.datetime.toDate() - a.datetime.toDate());
                setAppointments(appointmentsData);
            });
            
        return () => unsubscribe();
    }, []);
    
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const servicesCollection = await firestore().collection('services').get();
                const servicesData = servicesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setServices(servicesData);
            } catch (error) {
                console.error("Lỗi khi lấy dịch vụ: ", error);
            }
        };

        fetchServices();
    }, []);
    //ham hien thi gia tien
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    // show các lịch
    const renderItem = ({ item }) => {
        const service = services.find(s => s.id === item.serviceId);
        return (
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.orderHeader}>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>
                                {item.state === 'new' ? 'Đang duyệt' : 'Đã hoàn thành'}
                            </Text>
                        </View>
                        <Text style={styles.orderIdText}>
                            Mã đơn: {item.id.split('_').pop()}
                        </Text>
                    </View>

                    <Text style={styles.priceText}>
                        {formatPrice(item.totalPrice)} VNĐ
                    </Text>

                    <Text style={styles.dateText}>
                        {item.datetime ? item.datetime.toDate().toLocaleString() : 'Không xác định'}
                    </Text>

                    {service && (
                        <Text style={styles.dateText}>
                            Dịch vụ: {service.name}
                        </Text>
                    )}

                    <Button 
                        mode="contained"
                        style={styles.detailButton}
                        labelStyle={styles.detailButtonLabel}
                        onPress={() => navigation.navigate('OrderDetail', { order: item })}
                    >
                        Xem chi tiết
                    </Button>
                </Card.Content>
            </Card>
        );
    };
    
    const handleOrderDetail = (orderId) => {
        navigation.navigate("OrderDetail", { orderId });
    };

    return (
        <View style={{ flex: 1 , backgroundColor:"white"}}>
            
            <FlatList
                data={appointments}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    )
}

export default Appointments;
const styles = StyleSheet.create({
    card: {
        margin: 10,
        borderRadius: 15,
        elevation: 4,
        backgroundColor: '#FFFFFF',
        borderLeftWidth: 5,
        borderLeftColor: '#FFA500', // Màu cam cho trạng thái "Đang duyệt"
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    statusBadge: {
        backgroundColor: '#FFF3E0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    statusText: {
        color: '#FFA500',
        fontSize: 14,
        fontWeight: '600',
    },
    orderIdText: {
        fontSize: 14,
        color: '#666666',
    },
    priceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E2E2E',
        marginTop: 8,
    },
    dateText: {
        fontSize: 14,
        color: '#666666',
        marginTop: 4,
    },
    detailButton: {
        marginTop: 10,
        backgroundColor: '#FF9800',
        borderRadius: 8,
    },
    detailButtonLabel: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});