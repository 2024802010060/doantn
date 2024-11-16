import React,{useEffect} from "react";
import { Text } from "react-native-paper";
import {Image, View, StyleSheet,Button,ScrollView } from "react-native";
import {logout, useMyContextProvider } from "../index";
import { NavigationContainer } from "@react-navigation/native";
import Map from "./Map";
const ProfileCustomer = ({navigation}) =>{
    const [controller, dispatch] = useMyContextProvider();
    const { userLogin } = controller;
    
    const handleLogout = () => {
        logout(dispatch);
        navigation.navigate("Login");
    };
    const handleEdit = () => {
        navigation.navigate("ChangePassword");
    };
    return(
        <View style={styles.container}>
            {userLogin !== null ? (
                <>
                    <View style={styles.viewinfoRow}> 
                        <View style={{ 
                            alignItems: 'center', 
                            backgroundColor: '#FF8C00', 
                            flexDirection: 'row',
                            marginBottom: 10
                        }}> 
                            <Image source={require('../assets/account.png')} 
                            style={{ width: 75, height: 75, margin: 20, tintColor: 'white' }} />
                            <Text style={{fontSize: 20, color: 'white'}}>{userLogin.fullName}</Text>
                        </View>
                        
                        <View style={styles.infoRow}>
                            <Image source={require('../assets/phone.png')} 
                            style={{ width: 25, height: 25, marginRight: 10 }} />
                            <Text style={styles.label}>Điện thoại: </Text>
                            <Text style={styles.value}>{userLogin.phone}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Image source={require('../assets/email.png')} 
                            style={{ width: 25, height: 25, marginRight: 10 }} />
                            <Text style={styles.label}>Email: </Text>
                            <Text style={styles.value}>{userLogin.email}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Image source={require('../assets/padlock.png')} 
                            style={{ width: 25, height: 25, marginRight: 10 }} />
                            <Text style={styles.label}>Mật khẩu: </Text>
                            <Text style={styles.value}>{'*'.repeat(userLogin.password.length)}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Image source={require('../assets/place.png')} 
                            style={{ width: 25, height: 25, marginRight: 10 }} />
                            <Text style={styles.label}>Địa chỉ: </Text>
                            <Text style={styles.value}>{userLogin.address}</Text>
                        </View>
                        <View style={[styles.infoRow, {height:100}]}>
                            <Image source={require('../assets/question.png')} 
                            style={{ width: 25, height: 25, marginRight: 10 }} />
                            <Text style={styles.label}>Liên hệ: </Text>
                            <View >
                                <Text style={[styles.value, {textAlign: 'left', flexWrap: 'wrap'}]}>0343377477</Text>
                                <Text style={[styles.value, {textAlign: 'left', flexWrap: 'wrap'}]}>Chilick@gmail.com</Text>
                            </View>
                        </View>
                    </View> 
                    <View style={{ flex: 1, justifyContent: 'flex-end', paddingLeft: 40, paddingRight: 40, paddingBottom: 40 }}>
                        <Button
                            color={"#FF8C00"}
                            textColor="#000000"
                            mode="contained"
                            onPress={() => handleEdit(userLogin)}
                            title="Đổi mật khẩu"
                        />
                        <View style={{ paddingTop: 20 }}>
                            <Button
                                color={"#FF8C00"}
                                textColor="#000000"
                                mode="contained"
                                onPress={handleLogout}
                                title="Đăng xuất"
                            />
                        </View>
                    </View>
                </>
            ) : (
                <View style={styles.messageContainer}>
                    <Image 
                        source={require('../assets/account.png')} 
                        style={styles.loginImage}
                    />
                    
                    <Text style={styles.messageText}>
                        Vui lòng đăng nhập để xem thông tin cá nhân
                    </Text>
                    <View style={styles.loginButtonContainer}>
                        <Button
                            color={"#FF8C00"}
                            textColor="#000000"
                            mode="contained"
                            onPress={() => navigation.navigate('Login')}
                            title="Đăng nhập ngay"
                        />
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    
    header: {
        padding: 15,
        fontSize: 25,
        fontWeight: 'bold',
        backgroundColor: 'orange',
    },
    viewinfoRow: {
        
        maxWidth:800,
    },
    infoRow: {
        flexDirection: 'row',
        padding: 20,
        borderBottomWidth: 1,        // Thêm đường kẻ phía dưới
        borderBottomColor: '#ddd',   // Màu của đường kẻ
        alignItems: 'center',        // Căn giữa theo chiều dọc
        backgroundColor: '#fff',     // Nn trắng cho mỗi hàng
        marginBottom: 5,             // Khoảng cách giữa các hàng
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        width: '40%',               // Chiều rộng cố định cho label
    },
    value: {
        fontSize: 20,
        flex: 1,                    // Chiếm phần còn lại của hàng
        textAlign: 'right',         // Căn chỉnh văn bản sang bên phải
    },
    buttonContainer: {
        padding: 10,
        alignItems: 'center',
        
    },
    button: {
        width: '100',
        marginBottom: 10, // Khoảng cách giữa các nút
    },
    buttonLogout: {
        marginBottom: 10, // Đặt khoảng cách dưới cùng cho nút Đăng xuất
        
    },
    messageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    loginImage: {
        width: 150,
        height: 150,
        marginBottom: 30,
    },
    messageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF8C00',
        marginBottom: 10,
    },
    messageText: {
        fontSize: 22,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    loginButtonContainer: {
        width: '80%',
        marginTop: 10,
    },
});
export default ProfileCustomer;
