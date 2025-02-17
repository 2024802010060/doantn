import { StyleSheet, Text, TouchableOpacity, View, Alert, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import { TextInput, HelperText } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import {logout,  useMyContextProvider } from '../../store';

const ChangePassword = () => {
  const [currentPass, setCurrentPass] = useState('');
  const [password, setPassword] = useState('');
  const hasErrorPass = () => password.length < 6
  const navigation = useNavigation();

  const reauthenticate = () => {
    const user = auth().currentUser;
    const credential = auth.EmailAuthProvider.credential(user.email, currentPass);
    return user.reauthenticateWithCredential(credential);
  };
  
  const handleChangePassword = async () => {
    try {
      const user = auth().currentUser;
      
      if (!user) {
        Alert.alert('Lỗi', 'Người dùng hiện tại không tồn tại');
        return;
      }
      await reauthenticate();
      await user.updatePassword(password);
      firestore()
            .collection('USERS')
            .doc(user.email)
            .update({password: password})
            .then(() => {
                console.log("Customer updated successfully!");
                })
            .catch(error => {
                console.error("Error updating customer:", error);
            });
      Alert.alert('Thành công', 'Cập nhật mật khẩu thành công, vui lòng đăng nhập lại');
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert('Lỗi', 'Đổi mật khẩu thất bại');
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.textform}>Mật khẩu hiện tại</Text>
      <TextInput
        style={styles.input}
        value={currentPass}
        onChangeText={setCurrentPass}
        secureTextEntry
      />

      <Text style={styles.textform}>Mật khẩu mới</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <HelperText style={{alignSelf:'flex-start', marginLeft: 25,marginRight: 30,fontSize:18}} 
      type="error" visible={hasErrorPass()}>
        Mật khẩu mới phải từ 6 kí tự trở lên</HelperText>
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Đổi mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    backgroundColor:"white"
  },
  textform: {
    marginBottom: 8,
    fontSize: 20,
    margin: 30,
    color: 'black',
  },
  input: {
    backgroundColor: 'white',
    borderColor: '#80bfff',
    borderWidth: 1,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  button: {
    marginTop: 20,
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 30,
    marginRight: 30,
  },
});
