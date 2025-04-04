import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useTheme } from '../componentes/ThemeContext'; // Asegúrate de que la ruta sea correcta

const Pantallaempleado = ({ route }) => {
    const navigation = useNavigation();
    const { isNightMode } = useTheme(); // Usa el contexto para obtener el estado del modo nocturno
    const [modulosActivos, setModulosActivos] = useState([]);
    const usuario = route.params?.usuario || '';  
    const usuarion = route.params?.nombre;
    const img = route.params?.foto;
    const urlimg = "http://arturo.bonaquian.com/ProyectoFinalBacken/";
    const foto = urlimg + img;  

    const buttonList = [
        { id: '1', title: 'Usuario', screen: 'Usuario', modulo_codigo: 1 },
        { id: '2', title: 'Producto', screen: 'Productos', modulo_codigo: 2 },
        { id: '3', title: 'Cita Paciente', screen: 'Cita', modulo_codigo: 3 },
        { id: '4', title: 'Diagnostico', screen: 'Dianostico', modulo_codigo: 4 },
        { id: '5', title: 'Accesos', screen: 'AsignarModulos', modulo_codigo: 5 },
        { id: '6', title: 'VerBitacora', screen: 'VerBitacora', modulo_codigo: 6 },
        { id: '7', title: 'Desbloquear usuario', screen: 'PantallaReset', modulo_codigo: 7 },
        { id: '8', title: 'Reportes', screen: 'Reporte', modulo_codigo: 8 },
        { id: '9', title: 'Reportes_producto', screen: 'Reporte_Producto', modulo_codigo: 9 },
        { id: '10', title: 'Datos de Cita', screen: 'Reporte_Cita', modulo_codigo: 10},
        { id: '11', title: 'Datos de Diagnostico', screen: 'Reporte_Diagnostico', modulo_codigo: 11}
    ];

    useEffect(() => {
        if (!usuario) return;  

        const fetchUserAccess = async () => {
            try {
                const response = await axios.post('http://arturo.bonaquian.com/ProyectoFinalBacken/VerificarBotones.php', {
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
        <View style={[styles.container, { backgroundColor: isNightMode ? '#121212' : '#A3D5FF' }]}>
            <View style={styles.imageContainer}>
                {/* Circular Image */}
                <Image
                    source={{ uri: foto }} // Reemplaza con tu ruta de imagen local o URL
                    style={styles.topImage}
                />

                {/* Name Below the Image */}
                <Text style={[styles.userName, { color: isNightMode ? '#FFFFFF' : '#333' }]}>Usuario: {usuario}</Text>
                <Text style={[styles.userName, { color: isNightMode ? '#FFFFFF' : '#333' }]}>Nombre: {usuarion}</Text>
            </View>
            <Text style={[styles.title, { color: isNightMode ? '#FFFFFF' : '#000000' }]}>Módulos Disponibles</Text>

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
        color: '#FFFF', // Color del texto del botón
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#0A3D91', // Color de fondo del botón
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
    },
    userName: {
        fontSize: 18, // Ajusta el tamaño de fuente según sea necesario
        fontWeight: 'bold', // Hace que el texto sea negrita
        color: '#333', // Color de texto oscuro para contraste
        textAlign: 'center', // Centra el texto
        marginTop: -10, // Ajusta la posición si es necesario
    },
    topImage: {
        width: 200, // Establece un ancho fijo
        height: 200, // Establece una altura fija
        borderRadius: 100, // Mitad del ancho/altura para un círculo perfecto
        resizeMode: 'cover', // Asegura que la imagen se escale correctamente
        marginBottom: 20, // Espacio entre la imagen y el título
        overflow: 'hidden', // Evita que el contenido se desborde de los bordes redondeados
    },
});

export default Pantallaempleado;