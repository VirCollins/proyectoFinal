import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Principal = () => {
    const navigation = useNavigation();
    const [usuario, setUserName] = useState('');

    useEffect(() => {
        // Puedes agregar lógica aquí si es necesario
    }, []);

    const buttonList = [
        { id: '1', title: 'USUARIOS', screen: 'Usuario' },
        { id: '2', title: 'BITACORA', screen: 'VerBitacora' },
        { id: '3', title: 'DESBLOQUEO DE USUARIO', screen: 'PantallaReset' }/*,
        { id: '4', title: 'FORMTEST', screen: 'IngresoFoto' },
        { id: '5', title: 'Productos', screen: 'Notifications' },
        { id: '6', title: 'Accesos', screen: 'Notifications' },
        { id: '7', title: 'Clientes', screen: 'Notifications' }*/
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home Screen</Text>

            <FlatList
                data={buttonList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(item.screen)}>
                        <Image source={require('../../assets/perfil.png')} style={styles.icon} />
                        <Text style={styles.cardText}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false} // Hides vertical scrollbar
            />
        </View>
    );
};

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
    cardContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
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

export default Principal;
