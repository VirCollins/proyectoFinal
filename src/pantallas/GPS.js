import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const GPS = () => {
    const [coordenadas, setCoordenadas] = useState([]);

    useEffect(() => {
      const fetchCoordenadas = async () => {
        try {
            const response = await fetch('http://arturo.bonaquian.com/ProyectoFinalBacken/obtener_coordenadas.php'); // Cambia esto a tu URL
            const data = await response.json();
            if (data.success) {
                // Convertir las coordenadas a números
                const coords = data.coordenadas.map(coord => ({
                    id: coord.id,
                    latitude: parseFloat(coord.latitude), // Convertir a número
                    longitude: parseFloat(coord.longitude) // Convertir a número
                }));
                setCoordenadas(coords);
            } else {
                console.error('Error al obtener coordenadas:', data.message);
            }
        } catch (error) {
            console.error('Error al hacer la solicitud:', error);
        }
    };

        fetchCoordenadas();
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 37.78825, // Cambia esto a una latitud por defecto
                    longitude: -122.4324, // Cambia esto a una longitud por defecto
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {coordenadas.map((coord) => (
                    <Marker
                        key={coord.id}
                        coordinate={{ latitude: coord.latitude, longitude: coord.longitude }}
                        title={`Registro ${coord.id}`} // Asegúrate de que tu objeto tenga un título
                    />
                ))}
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
 
export default GPS;