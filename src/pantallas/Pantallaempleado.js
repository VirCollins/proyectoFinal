import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Pantallaempleado = ({ route }) => {
    const navigation = useNavigation();
    const [modulosActivos, setModulosActivos] = useState([]);
    const usuario = route.params?.usuario || '';  

    const buttonList = [
        { id: '1', title: 'Usuario', screen: 'Usuario', modulo_codigo: 1 },
        { id: '2', title: 'Producto', screen: 'VerBitacora', modulo_codigo: 2 },
        { id: '3', title: 'Cita Paciente', screen: 'GPS', modulo_codigo: 3 },
        { id: '4', title: 'Dianostico', screen: 'IngresoFoto', modulo_codigo: 4 },
        { id: '5', title: 'Accesos', screen: 'AsignarModulos', modulo_codigo: 5 },
        { id: '6', title: 'Desbloquear usuario', screen: 'PantallaReset', modulo_codigo: 6 },
        { id: '7', title: 'GPS', screen: 'GPS', modulo_codigo: 7 }
    ];

    useEffect(() => {
        if (!usuario) return;  

        const fetchUserAccess = async () => {
            try {
                const response = await axios.post('http://192.168.100.122/ProyectoFinalBacken/VerificarBotones.php', {
                    Usuario: usuario,
                });

                if (response.data.exito) {
                    const modulosNumericos = response.data.modulos.map(modulo => Number(modulo.codigo));
                    setModulosActivos(modulosNumericos);  
                }
            } catch (error) {
                console.error('Error al obtener los módulos del usuario:', error);
            }
        };
        
        fetchUserAccess();
    }, [route.params]);  

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Módulos Disponibles</Text>

            <FlatList
                data={buttonList.filter(item => modulosActivos.includes(Number(item.modulo_codigo)))}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate(item.screen)} 
                    >
                        <Image source={require('../../assets/perfil.png')} style={styles.icon} />
                        <Text style={styles.cardText}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#A3D5FF',
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
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFF'
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#0A3D91',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    icon: {
        width: 50,
        height: 50,
        marginRight: 10,
    }
});

export default Pantallaempleado;












