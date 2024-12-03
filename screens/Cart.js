import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useCart } from "../routers/CartContext"
import { Button } from 'react-native-paper';
import { useMyContextProvider } from "../index"
import { useNavigation } from '@react-navigation/native';
import firestore from "@react-native-firebase/firestore"
import moment from 'moment';

const Cart = () => {
  const navigation = useNavigation();
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const [controller] = useMyContextProvider();
  const { userLogin } = controller;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Check if userLogin is null
  if (!userLogin) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Bạn cần đăng nhập để xem giỏ hàng.</Text>
      </View>
    );
  }

  useEffect(() => {
    console.log("Cart context:", { cart, removeFromCart, clearCart, updateQuantity });
  }, []);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const renderItem = ({ item }) => (
      <View style={styles.item}>
        <Text style={{width: '30%', color: 'gray'}}>{item.title}</Text>
        <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={{ color: 'gray' }} >{item.quantity}</Text>
        <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
        </View>
        <Text style={{ color: 'gray' }}>
          Giá: {formatPrice(item.price * item.quantity)}
          <Text style={styles.fadedText}> VNĐ</Text> {/* Faded text */}
        </Text>
        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
          <Text style={styles.removeButton}>Xóa</Text>
        </TouchableOpacity>
      </View>
  );

  

  const increaseQuantity = (id) => {
    const item = cart.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };

  const decreaseQuantity = (id) => {
    const item = cart.find(item => item.id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    }
  };

  const handleSubmit = () => {
    // Check if the cart is empty
    if (cart.length === 0) {
      Alert.alert("Thông báo", "Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi đặt hàng.");
      return; // Exit the function if the cart is empty
    }
    navigation.navigate('IdentifyCart');
    
  }

  

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <View style={styles.bottomContainer}>
        
        <Text style={styles.total}>Tổng cộng: {formatPrice(total)} VNĐ</Text>
        <Button 
          style={styles.bookButton} 
          textColor="black" 
          buttonColor="orange" 
          mode="contained"
          labelStyle={{ fontSize: 17 }}
          onPress={handleSubmit}
        >
          Đặt hàng
        </Button>
      </View>
      <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
        <Text style={styles.clearButtonText}>Xóa giỏ hàng</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  item: {
    maxWidth: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    fontSize: 20,
    marginHorizontal: 10,
    color: 'gray'
  },
  removeButton: {
    color: 'red',
  },
  total: {
    flex: 2,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    color: 'black'
  },
  clearButton: {
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  clearButtonText: {
    fontSize:16,
    color: 'white',
    fontWeight: 'bold',
  },
  fadedText: {
    color: 'gray', // Change color to make it faded
    fontSize: 14,  // Adjust font size if needed
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginVertical: 10,
    paddingTop: 10, // Thêm padding để tạo khoảng cách với viền
  },
  bookButton: {
    flex: 1,
    maxWidth:'35%',
    borderRadius:0,
  },
});

export default Cart;
