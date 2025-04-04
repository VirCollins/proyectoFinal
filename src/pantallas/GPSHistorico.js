import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const GPSHistorico = ({ route }) => {
  const { latitude, longitude, usuario, descripcion, fecha } = route.params;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: parseFloat(latitude), // Asegúrate de que sea un número
          longitude: parseFloat(longitude), // Asegúrate de que sea un número
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: parseFloat(latitude), longitude: parseFloat(longitude) }}
          title={`Usuario: ${usuario}`}
          description={`Descripción: ${descripcion}\nFecha: ${fecha}`}
        />
      </MapView>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default GPSHistorico;