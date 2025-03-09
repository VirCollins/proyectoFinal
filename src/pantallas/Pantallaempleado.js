import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Pantallaempleado = () => {
    const navigation = useNavigation();
    const [userStatus, setUserStatus] = useState(null); // Para almacenar el estado del usuario (ACTIVO/INACTIVO)
    const [usuario, setUserName] = useState(''); // Nombre del usuario (esto lo puedes obtener dinámicamente, por ejemplo, desde la sesión)

    // Array de botones
    const buttonList = [
        { id: '1', title: 'usuario', screen: 'Usuario' },
        { id: '2', title: 'bitacora', screen: 'VerBitacora' },
        { id: '3', title: 'GPS', screen: 'NADA' },
        { id: '4', title: 'cliente', screen: 'IngresoFoto' },
        { id: '5', title: 'Producto', screen: 'Notifications' },
        { id: '6', title: 'Accesos', screen: 'Notifications' },
        { id: '7', title: 'DesbloquearUsuario', screen: 'PantallaReset' }
    ];

    useEffect(() => {
        const fetchUserStatus = async () => {
            try {
                const response = await axios.post('http://phpbacken123.whf.bz/ExamenBacken/backend1/VerificarBotones.php', {
                    Usuario: usuario, 
                });

                if (response.data.exito) {
                    setUserStatus(response.data.estado); 
                } else {
                    console.log("Error: " + response.data.mensaje);
                }
            } catch (error) {
                console.error('Error al obtener el estado del usuario:', error);
            }
        };

        if (usuario) { 
            fetchUserStatus();
        }
    }, [usuario]); 

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home Screen</Text>

            <FlatList
                data={buttonList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    // Solo mostrar los botones si el usuario está "ACTIVO"
                    if (userStatus === 'ACTIVO' || item.screen !== 'NADA') {
                        return (
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => navigation.navigate(item.screen)}
                            >
                                <Image source={require('../../assets/perfil.png')} style={styles.icon} />
                                <Text style={styles.cardText}>{item.title}</Text>
                            </TouchableOpacity>
                        );
                    }
                    return null;
                }}
                showsVerticalScrollIndicator={false} // Hides vertical scrollbar
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    cardText: {
        alignContent: 'center',
    },
    button: {
        flexDirection: 'row', // Aligns icon & text horizontally
        backgroundColor: '#e6e6df',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 20, // Rounded corners
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10, // Optional: add some space between buttons
    },
    icon: {
        width: 100,  // Set the width of the icon
        height: 100, // Set the height of the icon
        marginRight: 10, // Space between the icon and text
    }
});

export default Pantallaempleado;
