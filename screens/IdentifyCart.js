import React, { useState, useEffect }  from 'react';
import {View,Text,TextInput,StyleSheet,TouchableOpacity,ScrollView, Alert} from 'react-native';
import { useMyContextProvider } from "../index";
import moment from 'moment';
import { useCart } from "../routers/CartContext"
import firestore from "@react-native-firebase/firestore"
import { useNavigation } from '@react-navigation/native';

const initialDeliveryInfo = {
  fullName: '',
  phone: '',
  address: '',
  paymentMethod: 'unpaid',
  note: '',
};

const IdentifyCart = ({ navigation }) => {
    const [controller] = useMyContextProvider();
    const { userLogin } = controller;
    const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
    const customerId = userLogin?.email?.split('@')[0] || "";
    const timestamp = moment().format('YYMMDDHHmmss');
    const app_trans_id = `${timestamp}_${customerId}`;
    const [datetime, setDatetime] = useState(new Date());
    const newId = userLogin.email + userLogin.phone;
    const APPOINTMENTs = firestore().collection("Appointments");
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const [deliveryInfo, setDeliveryInfo] = useState(initialDeliveryInfo);

  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showPhoneSuggestion, setShowPhoneSuggestion] = useState(false);
  const [showAddressSuggestion, setShowAddressSuggestion] = useState(false);
  const [showPaymentMessage, setShowPaymentMessage] = useState(false);

  const handleFullNamePress = () => {
    if (userLogin?.fullName) {
      setShowSuggestion(true);
    }
  };

  const handlePhonePress = () => {
    if (userLogin?.phone) {
      setShowPhoneSuggestion(true);
    }
  };

  const handleAddressPress = () => {
    if (userLogin?.address) {
      setShowAddressSuggestion(true);
    }
  };

  const handleSubmit = () => {
    if (deliveryInfo.fullName === '' ) {
      Alert.alert("Thông báo", "Vui lòng điền tên khách hàng");
      return;
    }else
    if (deliveryInfo.phone === '' ) {
      Alert.alert("Thông báo", "Vui lòng điền số điện thoại");
      return;
    }else
    if (deliveryInfo.address === '' ) {
      Alert.alert("Thông báo", "Vui lòng điền địa chỉ giao hàng");
      return;
    }
    Alert.alert(
          "Xác nhận đặt hàng",
          "Bạn có chắc chắn muốn đặt đơn hàng này?",
          [
            {
              text: "Hủy",
              style: "cancel"
            },
            {
              text: "Đặt hàng",
              onPress: () => {
                const services = cart.map(item => ({
                  title: item.title,
                  quantity: item.quantity,
                  price:item.price,
                }));
                
    
                APPOINTMENTs
                  .add({
                    id: app_trans_id,
                    email: userLogin.email,
                    fullName: deliveryInfo.fullName,
                    address: deliveryInfo.address,
                    services,
                    totalPrice: total,
                    phone: deliveryInfo.phone,
                    datetime,
                    state: "new",
                    appointment: deliveryInfo.paymentMethod,
                    note: deliveryInfo.note
                  })
                  .then(r => {
                    APPOINTMENTs.doc(r.id).update({ id: app_trans_id });
                  });
                  Alert.alert(
                    "Thành công",
                    "Sản phẩm đã được đặt thành công",
                    [{ 
                      text: "OK",
                      onPress: () => {
                        // Reset form
                        navigation.navigate('Cart');
                      }
                    }]
                  );
      
                  clearCart();
              }
            }
          ]
        );
  };

  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thông tin giao hàng</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Họ và tên</Text>
        <TextInput
          style={styles.input}
          value={deliveryInfo.fullName}
          onChangeText={(text) => setDeliveryInfo({...deliveryInfo, fullName: text})}
          placeholder="Nhập họ và tên"
          onFocus={handleFullNamePress}
        />
        {showSuggestion && userLogin?.fullName && (
          <TouchableOpacity 
            style={styles.suggestion}
            onPress={() => {
              setDeliveryInfo({...deliveryInfo, fullName: userLogin.fullName});
              setShowSuggestion(false);
            }}
          >
            <View style={styles.suggestionContent}>
              <Text style={styles.suggestionLabel}>Sử dụng thông tin đã lưu</Text>
              <Text style={styles.suggestionText}>{userLogin.fullName}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          value={deliveryInfo.phone}
          onChangeText={(text) => setDeliveryInfo({...deliveryInfo, phone: text})}
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
          onFocus={handlePhonePress}
        />
        {showPhoneSuggestion && userLogin?.phone && (
          <TouchableOpacity 
            style={styles.suggestion}
            onPress={() => {
              setDeliveryInfo({...deliveryInfo, phone: userLogin.phone});
              setShowPhoneSuggestion(false);
            }}
          >
            <View style={styles.suggestionContent}>
              <Text style={styles.suggestionLabel}>Sử dụng thông tin đã lưu</Text>
              <Text style={styles.suggestionText}>{userLogin.phone}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Địa chỉ</Text>
        <TextInput
          style={styles.input}
          value={deliveryInfo.address}
          onChangeText={(text) => setDeliveryInfo({...deliveryInfo, address: text})}
          placeholder="Nhập địa chỉ giao hàng"
          multiline
          onFocus={handleAddressPress}
        />
        {showAddressSuggestion && userLogin?.address && (
          <TouchableOpacity 
            style={styles.suggestion}
            onPress={() => {
              setDeliveryInfo({...deliveryInfo, address: userLogin.address});
              setShowAddressSuggestion(false);
            }}
          >
            <View style={styles.suggestionContent}>
              <Text style={styles.suggestionLabel}>Sử dụng thông tin đã lưu</Text>
              <Text style={styles.suggestionText}>{userLogin.address}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phương thức thanh toán</Text>
        <View style={styles.paymentOptions}>
            <TouchableOpacity 
                style={styles.paymentOption}
                onPress={() => {
                  setDeliveryInfo({...deliveryInfo, paymentMethod: 'unpaid'});
                  setShowPaymentMessage(false);
                }}
            >
                <View style={styles.radio}>
                    {deliveryInfo.paymentMethod === 'unpaid' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.paymentText}>Thanh toán trực tiếp</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.paymentOption}
                onPress={() => {
                  setDeliveryInfo({...deliveryInfo, paymentMethod: 'online'});
                  setShowPaymentMessage(true);
                }}
            >
                <View style={styles.radio}>
                    {deliveryInfo.paymentMethod === 'online' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.paymentText}>Thanh toán online</Text>
            </TouchableOpacity>
        </View>
      </View>
      {showPaymentMessage && (
        <View style={styles.messageContainer}>
          <Text style={styles.paymentMessage}>
            Đơn hàng sẽ được giao khi hoàn tất thanh toán
          </Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ghi chú</Text>
        <TextInput
          style={[styles.input, styles.noteInput]}
          value={deliveryInfo.note}
          onChangeText={(text) => setDeliveryInfo({...deliveryInfo, note: text})}
          placeholder="Nhập ghi chú cho đơn hàng (nếu có)"
          multiline
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    marginBottom: 20,
    color: '#000000',
    marginTop: 8,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333333',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  noteInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 30,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  suggestion: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  suggestionContent: {
    padding: 12,
  },
  suggestionLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '500',
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  paymentText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
  },
  messageContainer: {
    marginTop: -10,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  paymentMessage: {
    color: '#FF0000',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default IdentifyCart;
