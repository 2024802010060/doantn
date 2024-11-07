import React, { useState, useEffect } from "react";
import { Image, TextInput, View, FlatList, TouchableOpacity, Alert,StyleSheet, ImageBackground,  } from "react-native";
import { IconButton, Text } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { Dimensions } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";

const ServicesCustomer = ({ navigation, route }) => {
    
    const [initialServices, setInitialServices] = useState([]);
    const [services, setServices] = useState([]);
    const [opi, setOpi] = useState([]);
    const [categories, setCategories] = useState([]); // State to hold categories

    const filterByCategory = (category) => {
        if (category === 'all') {
            setServices(initialServices); // Hiển thị tất cả sản phẩm
        } else {
            const result = initialServices.filter(service => service.type === category);
            setServices(result);
            
        }
    };

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('Services')
            .onSnapshot(querySnapshot => {
                const services = [];
                querySnapshot.forEach(documentSnapshot => {
                    services.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setServices(services);
                setOpi(services);
                setInitialServices(services);
            });

        return () => unsubscribe();
    }, []);

    const [name, setName] = useState('')
    const renderItem = ({ item }) => (
        <>
        <View style={{marginRight:20,marginLeft:20, height: 1, backgroundColor: '#DDDDDD' }} />
            <TouchableOpacity onPress={() => handleAppointment(item)} style={styles.borderender}>
                <View style={[styles.viewrender]}>
                    {item.image !== "" && (
                        <Image
                            source={{ uri: item.image }}
                            style={styles.imagerender}
                            resizeMode="center"
                        />
                    )}
                </View>
                <View style={{ height: 100, width: 230, marginTop: 5 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", paddingTop: 5 }}>{item.title}</Text>
                    <Text style={{ fontSize: 18, fontWeight: "bold", paddingTop: 5 }}>Giá: {item.price} vnđ</Text>
                </View>
            </TouchableOpacity>
            
        </>
    );
    const randomitem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => handleAppointment(item)} 
            style={styles.borderrandom}>
            <View style={styles.viewrandom}>
                {item.image !== "" && (
                    <Image
                        source={{ uri: item.image }}
                        style={styles.imagerandom}
                        resizeMode="stretch"
                    />
                )}
            </View>
            <View >
                <Text style={{fontSize: 18, fontWeight: "bold",paddingLeft:10}}>{item.title}</Text>
                <Text style={{fontSize: 18, fontWeight: "bold",paddingLeft:10}}>{item.price} vnđ</Text>
            </View>
        </TouchableOpacity>
    );
    

    useEffect(() => {
        const fetchCategories = async () => {
            const categorySnapshot = await firestore().collection('Type').get();
            const categoryList = categorySnapshot.docs.map(doc => doc.data().type); // Assuming 'type' is the field name
            setCategories(categoryList);
           
        };

        fetchCategories();
    }, []);
    
    const handleAppointment = (service) => {
        navigation.navigate("Appointment", { service });
    }
    const bannerImages = [
        require("../assets/banner1.png"),
        require("../assets/banner2.png"),
        
        // Add more images as needed
    ];

    
    return (
        <FlatList
            data={services}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={styles.flatmain}
            ListHeaderComponent={
                <>
                    <View style={{ flex: 1}}>
            <View style={{paddingLeft:20,paddingRight:20, alignItems: 'center', }} >
                <TextInput
                    value={name}
                    placeholder="Tìm kiếm"
                    placeholderTextColor="black"
                    style={styles.inputContainerStyle}
                    onChangeText={(text) => {
                        setName(text);
                        const result = initialServices.filter(service => service.title.toLowerCase().includes(text.toLowerCase()));
                        setServices(result);
                    }}
                    
                />
            </View>
            <View>
                <SwiperFlatList
                    autoplay
                    autoplayDelay={3}
                    autoplayLoop
                    index={0}
                    showPagination
                    data={bannerImages}
                    horizontal={true}
                    snapToInterval={Dimensions.get('window').width}
                    decelerationRate="fast"
                    style={{ 
                        width: Dimensions.get('window').width,
                        height: 220
                    }}
                    renderItem={({ item }) => (
                        <View style={{
                            width: Dimensions.get('window').width,
                            height: 220,
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 10
                        }}>
                            <Image 
                                source={item} 
                                style={{
                                    width: '95%',
                                    height: '100%',
                                    borderRadius: 10,
                                    resizeMode: 'cover'
                                }} 
                            />
                        </View>
                    )}
                    paginationStyleItem={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        marginHorizontal: 4,
                        backgroundColor: 'rgba(0, 0, 0, 0.2)'
                    }}
                    paginationStyleItemActive={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)'
                    }}
                />
            </View>
            <View style={{backgroundColor:'#EEEEEE', height:10}}><Text></Text></View>
            <View style={{marginTop:10}}>
            
            <View style={{marginLeft: 20,flexDirection: "row" }}>
                <TouchableOpacity style={styles.categoryButton} onPress={() => filterByCategory('all')}>
                    <Text style={styles.buttonText}>Tất cả</Text>
                </TouchableOpacity>
                {categories.map((category, index) => (
                    <TouchableOpacity key={index} style={[styles.categoryButton, { backgroundColor: 'white' }]} onPress={() => filterByCategory(category)}>
                        <Text style={styles.buttonText}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            </View>
            <View style={{
                justifyContent: "space-between",
                
            }}>
                <View style={{
                
                flexDirection: "row" 
            }}>
                <Image source={require('../assets/fire.png')} style={{ width: 35, height: 35, marginLeft: 15, marginTop: 15, marginBottom: 5 }} />
                <Text style={{
                    padding: 15,
                    fontSize: 30,
                    fontWeight: "bold",
                    alignItems: "left",
                    color:'red'
                }}>
                    Bán chạy</Text>
                </View>
                <FlatList
                data={opi}
                showsHorizontalScrollIndicator={false}
                renderItem={randomitem}
                keyExtractor={item => item.id}
                style={{height:180, backgroundColor:'white'}}
                horizontal // Set the FlatList to display items horizontally
            />
            </View>
            
            <View style={{
                
                
                justifyContent: "space-between"
            }}>
                <Text style={{
                    padding: 15,
                    fontSize: 25,
                    fontWeight: "bold",
                    alignItems: "left",
                }}>
                    Danh sách sản phẩm</Text>
                    
            </View>
            
        </View>
                </>
            }
        />
    );
};
const styles = StyleSheet.create({
    
    flatmain: {
        backgroundColor:'white',
        
    },
    Viewimg: {
        paddingLeft:15,
        justifyContent:"center", 
        alignSelf:"center",
        
    },
    
    imagerandom: {
        width:150,
        height:100,
        borderRadius:15
    },
    borderrandom:{
        width: 152,
        height: 160,
        margin: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'black',
    },
    viewrandom: {
        width: 150,
        height: 100, // Điều chỉnh chiều cao để phù hợp với tỷ lệ hình ảnh
        borderRadius: 15,
        backgroundColor:'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagerender: {
        width:150,
        height:100,
        borderRadius: 15,
    },
    borderender:{
        flexDirection: "row",
        height:110, 
        margin: 10,
        
    },
    viewrender: {
        width: 130,
        height: 90, // Điều chỉnh chiều cao để phù hợp với tỷ lệ hình ảnh
        borderRadius: 10,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    bannerSlide: {
        width: '90%',
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
        marginBottom: 160,
        
    },
    inputContainerStyle:{
        color:'black',
        borderColor: "black", // Viền ngoài màu đen
        backgroundColor: "white",
        borderWidth: 1, // Độ dày viền
        borderRadius: 10, // Bo tròn góc
        marginTop: 10,
        width: '97%', // Đặt chiều rộng theo tỷ lệ phần trăm
        alignSelf: 'center' // Căn giữa input
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 10,
    },
    buttonContainer: {
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'white',
        borderRadius: 20, // Để tạo hình tròn
        padding: 3, // Thêm khoảng cách bên trong
    },
    categoryButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        margin: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    icon: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
        borderRadius: 10,
    },
})
export default ServicesCustomer;
