import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { PermissionsAndroid } from 'react-native';

// Khởi tạo Geocoder với API key của bạn
const apiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Thay YOUR_GOOGLE_MAPS_API_KEY bằng API key của bạn
Geocoder.init(apiKey);
console.log("Using API Key:", apiKey); // Log API key để kiểm tra

const Map = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [address, setAddress] = useState(''); // Thêm state để lưu địa chỉ
  const [inputAddress, setInputAddress] = useState(''); // State cho địa chỉ nhập vào

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location");
      } else {
        console.log("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  
  useEffect(() => {
    requestLocationPermission().then(() => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ latitude, longitude });

          // Chuyển đổi tọa độ thành địa chỉ
          Geocoder.from(latitude, longitude)
            .then(json => {
              const addressComponent = json.results[0].formatted_address;
              setAddress(addressComponent); // Cập nhật địa chỉ
            })
            .catch(error => console.log(error));
        },
        (error) => console.log(error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    });
  }, []);

  const searchAddress = () => {
    console.log("Searching for address:", inputAddress); // Thêm dòng này để kiểm tra
    Geocoder.from(inputAddress)
      .then(json => {
        console.log("Geocoder response:", json); // Thêm dòng này để kiểm tra phản hồi
        const location = json.results[0].geometry.location;
        setCurrentPosition({ latitude: location.lat, longitude: location.lng });
        setAddress(json.results[0].formatted_address);
      })
      .catch(error => console.log("Error:", error)); // Thêm thông báo lỗi
  };

  const refreshLocation = () => {
    console.log("Refreshing location..."); // Log để kiểm tra
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Current position:", { latitude, longitude }); // Log vị trí hiện tại
        setCurrentPosition({ latitude, longitude });

        // Chuyển đổi tọa độ thành địa chỉ
        Geocoder.from(latitude, longitude)
          .then(json => {
            const addressComponent = json.results[0].formatted_address;
            setAddress(addressComponent); // Cập nhật địa chỉ
            console.log("Address updated:", addressComponent); // Log địa chỉ
          })
          .catch(error => console.log("Geocoder error:", error)); // Log lỗi Geocoder
      },
      (error) => console.log("Geolocation error:", error), // Log lỗi Geolocation
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, paddingLeft: 10 }}
        placeholder="Nhập địa chỉ"
        value={inputAddress}
        onChangeText={setInputAddress} // Cập nhật địa chỉ nhập vào
      />
      <Button title="Tìm kiếm" onPress={searchAddress} />
      <Button title="Làm mới vị trí" onPress={refreshLocation} />
      <Text style={{ padding: 10 }}>Địa chỉ hiện tại: {address}</Text> 
      <MapView
        style={{ flex: 1 }}
        initialRegion={currentPosition ? {
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        } : {
          latitude: 11.0036,
          longitude: 106.6729,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {currentPosition && (
          <Marker
            coordinate={currentPosition}
            title={"Vị trí hiện tại"}
            description={address}
          />
        )}
         <Marker
          coordinate={{ latitude: 10.9803, longitude: 106.6744 }} // Tọa độ của Trường Đại Học Thủ Dầu Một
          title={"Trường Đại Học Thủ Dầu Một"}
          description={"Địa chỉ: 6 Nguyễn Văn Tiết, Phú Hòa, Thủ Dầu Một, Bình Dương"}
        />
      </MapView>
    </View>
  );
};

export default Map;
