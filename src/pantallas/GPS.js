import React,{useState,useEffect} from 'react';
import { View, Text, PermissionsAndroid, Platform,StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import MapView,{Marker} from 'react-native-maps';

const GPS = () => {
    const [location, setLocation] = useState(null);
  const getLocation = async () => {
    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission denied');
        return;
      }

      // Get current position
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation.coords);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  if (!location) {
    return <Text>Loading location...</Text>;
  }
  const mostrarCoordenadas = () => {
    if (location) {
      console.log("Coordenada:", location);
      console.log("Latitude:", location.latitude);
      console.log("Longitud:", location.longitude);
    }
  };
  return (
    
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Your Location"
        />
      </MapView>
      <Text>{mostrarCoordenadas()}</Text>
    </View>
    
  );
}
export default GPS;
