import React, { useState, useEffect } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText, IconButton } from 'react-native-paper';
import { createAccount } from '../index';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Register = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [disableCreate, setDisableCreate] = useState(true);

  const hasErrorFullName = () => fullName === "";
  const hasErrorEmail = () => !email.includes('@');
  const hasErrorPassword = () => password.length < 6;
  const hasErrorPasswordConfirm = () => confirmPassword !== password;
  const hasDiaChi = () => address === "";
  useEffect(() => {
    setDisableCreate(
      hasErrorFullName() ||
      hasErrorEmail() ||
      hasErrorPassword() ||
      hasErrorPasswordConfirm() ||
      phone.trim() === '' ||
      address.trim() === ''
    );
  }, [fullName, email, password, confirmPassword, phone, address, hasErrorFullName, hasErrorEmail, hasErrorPassword, hasErrorPasswordConfirm]);

  const handleRegister = () => {
    createAccount(email, password, fullName, phone, address, role);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ĐĂNG KÝ TÀI KHOẢN</Text>
      
      <TextInput
          label="Họ và tên"
          value={fullName}
          onChangeText={setFullname}
          style={styles.input}
          mode="outlined"
        />
        <HelperText type="error" visible={hasErrorFullName()} style={styles.errorText}>
          Họ và tên không được để trống
        </HelperText>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
      />
      <HelperText type="error" visible={hasErrorEmail()} style={styles.errorText}>
        Địa chỉ email không hợp lệ
      </HelperText>

      <View style={styles.passwordContainer}>
        <TextInput
          label="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
          mode="outlined"
          right={
            <TextInput.Icon
              icon={() => (
                <Image
                  source={showConfirmPassword ? require('../assets/eye-hidden.png') : require('../assets/eye.png')}
                  style={{ width: 24, height: 24 }}
                />
              )}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
      </View>
      <HelperText type="error" visible={hasErrorPassword()} style={styles.errorText}>
        Password ít nhất 6 kí tự
      </HelperText>

      <View style={styles.passwordContainer}>
        <TextInput
          label="Nhập lại mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          style={styles.passwordInput}
          mode="outlined"
          right={
            <TextInput.Icon
              icon={() => (
                <Image
                  source={showConfirmPassword ? require('../assets/eye-hidden.png') : require('../assets/eye.png')}
                  style={{ width: 24, height: 24 }}
                />
              )}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
        />
      </View>
      
      <HelperText type="error" visible={hasErrorPasswordConfirm()} style={styles.errorText}>
        Confirm Password phải giống với Password
      </HelperText>
      <TextInput
              label="Địa chỉ"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
              mode="outlined"
            />
      <HelperText type="error" visible={hasDiaChi()} style={styles.errorText}>
        Hãy nhập địa chỉ của bạn
      </HelperText>
      <View style={styles.inputContainer}>
      <TextInput
        label="Điện thoại"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        mode="outlined"
      />
      </View>
      <Button 
        style={styles.button} 
        labelStyle={styles.buttonText}
        mode="contained" 
        onPress={handleRegister} 
        disabled={disableCreate}
      >
        Tạo tài khoản
      </Button>

      <View style={styles.loginPrompt}>
        <Text style={styles.promptText}>Bạn đã có tài khoản?</Text>
        <Button onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>Đăng nhập</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "center",
    color: "orange",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 0, // Remove bottom margin from input
  },
  errorText: {
    marginTop: 2, // Add a small top margin to separate from input
    paddingHorizontal: 12, // Match padding with TextInput for alignment
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: 'center',
   
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 5,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    
  },
  promptText: {
    fontSize: 16,
  },
  loginText: {
    color: "blue",
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Register;
