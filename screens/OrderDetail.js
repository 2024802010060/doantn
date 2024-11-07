import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore'; // Import Firebase

const OrderDetail = ({ route, navigation }) => {
    const { order } = route.params; // Nhận thông tin đơn hàng từ params
    const [orderData, setOrderData] = useState(null); // State để lưu dữ liệu đơn hàng

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const orderDoc = await firestore()
                    .collection('Appointments')
                    .doc(order.id) // Lấy dữ liệu dựa trên order.id
                    .get();

                if (orderDoc.exists) {
                    setOrderData(orderDoc.data()); // Lưu toàn bộ dữ liệu đơn hàng
                } else {
                    console.log("Không tìm thấy đơn hàng");
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu đơn hàng: ", error);
            }
        };

        fetchOrderData();
    }, [order.id]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chi tiết đơn hàng</Text>
            {orderData ? (
                <View style={styles.orderDetails}>
                    <Text style={styles.status}>
                        Trạng thái: {
                            orderData.state === 'new' ? 'Đang duyệt' : 
                            orderData.state === 'complete' ? 'Đã hoàn thành' : 
                            orderData.state
                        }
                    </Text>
                    <Text style={styles.datetime}>Thời gian: {orderData.datetime ? orderData.datetime.toDate().toLocaleString() : 'Không xác định'}</Text>
                    <Text style={styles.totalPrice}>Tổng tiền: {orderData.totalPrice}.000 vnđ</Text>
                    <Text style={styles.totalPrice}>
                        Thanh toán: {orderData.appointment === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </Text>
                    <Text style={styles.summaryTitle}>Tóm tắt đơn hàng:</Text>
                    {Array.isArray(orderData.services) ? (
                        orderData.services.map((service, index) => (
                            <View key={index} style={styles.serviceContainer}>
                                <View style={styles.serviceRow}>
                                    <Text style={styles.serviceTitle}>{service.title} x{service.quantity}</Text>
                                    <Text style={styles.serviceTitle}> {service.price} vnđ</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={{color: 'black'}}>Không xác định</Text>
                    )}
                </View>
            ) : (
                <Text>Đang tải dữ liệu...</Text>
            )}
            <Button mode="contained" onPress={() => navigation.navigate("PaymentZalo", { orderId: orderData.id })} style={styles.button}>Thanh toán online</Button>
        </View>
    );
};

export default OrderDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    orderDetails: {
        
    },
    status: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
    datetime: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    serviceContainer: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    serviceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    serviceTitle: {
        fontSize: 20, // Đặt kích thước chữ lớn hơn
        fontWeight: '500',
    },
    servicePrice: {
        fontSize: 16,
        color: '#555',
    },
    optionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
    },
    option: {
        fontSize: 14,
        color: '#333',
    },
    button: {
        marginTop: 20,
    },
});