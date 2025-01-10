import React,{useEffect, useState} from "react";
import { Text, Modal, TextInput, Button as PaperButton, IconButton } from "react-native-paper";
import {Image, View, StyleSheet,Button,ScrollView, ActivityIndicator, Alert } from "react-native";
import {logout, useMyContextProvider } from "../index";
import { NavigationContainer } from "@react-navigation/native";
import Map from "./Map";
import firestore from "@react-native-firebase/firestore";

const ProfileCustomer = ({navigation}) =>{
    const [controller, dispatch] = useMyContextProvider();
    const { userLogin } = controller;
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [newPhone, setNewPhone] = useState('');
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState('');
    const [user, setUser] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const handleLogout = () => {
        logout(dispatch);
        navigation.navigate("Login");
    };
    const handleEdit = () => {
        navigation.navigate("ChangePassword");
    };

    useEffect(() => {
        // Sử dụng onSnapshot để lắng nghe thay đổi realtime
        const unsubscribe = firestore()
            .collection('USERS')
            .where('email', '==', userLogin.email)
            .onSnapshot(querySnapshot => {
                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs[0].data();
                    setUser(data);
                } else {
                    console.log("Không tìm thấy khách hàng");
                }
            }, error => {
                console.error("Lỗi khi lấy dữ liệu khách hàng: ", error);
            });
    
        // Cleanup function
        return () => unsubscribe();
    }, []);

    

    const handleChangePhone = async () => {
        if (!newPhone || newPhone.length < 10) {
            Alert.alert(
                "Thông báo",
                "Vui lòng nhập số điện thoại hợp lệ (ít nhất 10 số)",
                [{ text: "Đồng ý" }]
            );
            return;
        }

        setIsLoading(true);
        try {
            // Sử dụng email của người dùng làm document ID
            if (!userLogin || !userLogin.email) {
                throw new Error('Không tìm thấy thông tin người dùng');
            }

            // Cập nhật trong Firebase
            await firestore()
                .collection('USERS')
                .doc(userLogin.email)
                .update({
                    phone: newPhone
                });

            // Cập nhật state local
            dispatch({
                type: 'SET_USER_LOGIN',
                payload: {
                    ...userLogin,
                    phone: newPhone
                }
            });

            setIsEditingPhone(false);
            setNewPhone('');
            Alert.alert(
                "Thông báo",
                "Cập nhật số điện thoại thành công!",
                [{ text: "Đồng ý" }]
            );
        } catch (error) {
            console.error('Lỗi khi cập nhật số điện thoại:', error);
            Alert.alert(
                "Thông báo",
                "Có lỗi xảy ra khi cập nhật số điện thoại",
                [{ text: "Đồng ý" }]
            );
        } finally {
            setIsLoading(false);
        }
    };
    const handleChangeAddress = async () => {
        if (!newAddress) {
            Alert.alert(
                "Thông báo",
                "Vui lòng nhập địa chỉ mới",
                [{ text: "Đồng ý" }]
            );
            return;
        }

        setIsLoading(true);
        try {
            if (!userLogin || !userLogin.email) {
                throw new Error('Không tìm thấy thông tin người dùng');
            }

            // Cập nhật trong Firebase
            await firestore()
                .collection('USERS')
                .doc(userLogin.email)
                .update({
                    address: newAddress
                });

            // Cập nhật state local
            dispatch({
                type: 'SET_USER_LOGIN',
                payload: {
                    ...userLogin,
                    address: newAddress
                }
            });

            setIsEditingAddress(false);
            setNewAddress('');
            Alert.alert(
                "Thông báo",
                "Cập nhật địa chỉ thành công!",
                [{ text: "Đồng ý" }]
            );
        } catch (error) {
            console.error('Lỗi khi cập nhật địa chỉ:', error);
            Alert.alert(
                "Thông báo",
                "Có lỗi xảy ra khi cập nhật địa chỉ",
                [{ text: "Đồng ý" }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await firestore()
                    .collection('USERS')
                    .doc(userLogin.email)
                    .get();

                if (userDoc.exists) {
                    const userData = userDoc.data();
                    dispatch({
                        type: 'SET_USER_LOGIN',
                        payload: userData
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [navigation]);

    return(
        <View style={styles.container}>
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#FF8C00" />
                    <Text style={styles.loadingText}>Đang xử lý...</Text>
                </View>
            )}
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
                            <Image source={require('../assets/phone.png')} 
                            style={{ width: 25, height: 25, marginRight: 10 }} />
                            <Text style={styles.label}>Điện thoại: </Text>
                            <Text style={styles.value}>{user.phone}</Text>
                            <IconButton
                                icon={() => (
                                    <Image 
                                        source={require('../assets/edit.png')} 
                                        style={{ width: 25, height: 25 }}
                                    />
                                )}
                                onPress={() => setIsEditingPhone(!isEditingPhone)}
                                style={{ margin: 0, marginRight: -10 }}
                            />
                        </View>
                        
                        {isEditingPhone && (
                            <View style={styles.phoneEditContainer}>
                                <TextInput
                                    value={newPhone}
                                    onChangeText={(text) => {
                                        // Only allow digits
                                        const numbersOnly = text.replace(/[^0-9]/g, '');
                                        setNewPhone(numbersOnly);
                                    }}
                                    keyboardType="phone-pad"
                                    style={styles.phoneInput}
                                    placeholder="Nhập số điện thoại mới"
                                />
                                <View style={styles.phoneEditButtons}>
                                    <Button
                                        color={"#FF8C00"}
                                        textColor="#000000"
                                        mode="contained"
                                        onPress={() => setIsEditingPhone(false)}
                                        title="Hủy"
                                    />
                                    <View style={{width: 10}} />
                                    <Button
                                        color={"#FF8C00"}
                                        textColor="#000000"
                                        mode="contained"
                                        onPress={handleChangePhone}
                                        title={isLoading ? "Đang lưu..." : "Lưu"}
                                        disabled={isLoading}
                                    />
                                </View>
                            </View>
                        )}
                        
                        
                        <View style={styles.infoRow}>
                            <Image source={require('../assets/place.png')} 
                            style={{ width: 25, height: 25, marginRight: 10 }} />
                            <Text style={styles.label}>Địa chỉ: </Text>
                            <Text style={styles.value}>{user.address}</Text>
                            <IconButton
                                icon={() => (
                                    <Image 
                                        source={require('../assets/edit.png')} 
                                        style={{ width: 25, height: 25 }}
                                    />
                                )}
                                onPress={() => setIsEditingAddress(!isEditingAddress)}
                                style={{ margin: 0, marginRight: -10 }}
                            />
                        </View>
                        {isEditingAddress && (
                            <View style={styles.phoneEditContainer}>
                                <TextInput
                                    value={newAddress}
                                    onChangeText={setNewAddress}
                                    style={styles.phoneInput}
                                    placeholder="Nhập địa chỉ mới"
                                />
                                <View style={styles.phoneEditButtons}>
                                    <Button
                                        color={"#FF8C00"}
                                        textColor="#000000"
                                        mode="contained"
                                        onPress={() => setIsEditingAddress(false)}
                                        title="Hủy"
                                    />
                                    <View style={{width: 10}} />
                                    <Button
                                        color={"#FF8C00"}
                                        textColor="#000000"
                                        mode="contained"
                                        onPress={handleChangeAddress}
                                        title="Lưu"
                                    />
                                </View>
                            </View>
                        )}
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
        borderBottomWidth: 1,        // Thêm đường kẻ phía dưi
        borderBottomColor: '#ddd',   // Màu của đường kẻ
        alignItems: 'center',        // Căn giữa theo chiều dọc
        backgroundColor: '#fff',     // Nn trắng cho m���i hàng
        marginBottom: 5,             // Khoảng cách giữa các hàng
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        width: '30%',
    },
    value: {
        fontSize: 20,
        flex: 1,
        textAlign: 'left',
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
    phoneEditContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 5,
    },
    phoneInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    phoneEditButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    loadingOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16
    },
});
export default ProfileCustomer;
