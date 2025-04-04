import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList, Image, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../componentes/ThemeContext'; // Importa el hook del contexto

const Reporte = () => {
    const navigation = useNavigation();
    const { isNightMode } = useTheme(); // Usa el contexto para obtener el estado del modo nocturno

    const buttonList = [
        { id: '1', title: 'Usuario Lista', url: 'http://arturo.bonaquian.com/ProyectoFinalBacken/ReporteListaUsuario.php' },
        { id: '2', title: 'Datos de Usuario', screen: 'Reporte_usuario'},
        { id: '3', title: 'Datos de Producto', screen: 'Reporte_Producto'},
        { id: '4', title: 'Datos de Cita', screen: 'Reporte_Cita'},
        { id: '5', title: 'Datos de Diagnostico', screen: 'Reporte_Diagnostico'},
        // Agrega más botones según sea necesario
    ];

    const openPdf = async (url) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert('Error', 'No se pudo abrir el archivo PDF');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: isNightMode ? '#121212' : '#A3D5FF' }]}>
            <Text style={[styles.title, { color: isNightMode ? '#FFFFFF' : '#000000' }]}>Reportes</Text>

            <FlatList
                data={buttonList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: isNightMode ? '#0A3D91' : '#0A3D91'}]} 
                        onPress={() => item.url ? openPdf(item.url) : navigation.navigate(item.screen)}
                    >
                        <Image source={require('../../assets/perfil.png')} style={styles.icon} />
                        <Text style={[styles.cardText, { color: isNightMode ? '#FFFFFF' : '#FFFFFF' }]}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false} // Oculta la barra de desplazamiento vertical
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
        alignContent: 'center',
    },
    button: {
        flexDirection: 'row', // Alinea el icono y el texto horizontalmente
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 20, // Esquinas redondeadas
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10, // Espacio entre botones
    },
    icon: {
        width: 100,  // Ancho del icono
        height: 100, // Altura del icono
        marginRight: 10, // Espacio entre el icono y el texto
    }
});

export default Reporte;