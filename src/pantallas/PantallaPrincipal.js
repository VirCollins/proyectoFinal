import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Boton from '../componentes/Boton';
import CampoTexto from '../componentes/CampoTexto';
import { useNavigation } from '@react-navigation/native';
import Ubicacion from '../componentes/Ubicacion';
import { useTheme } from '../componentes/ThemeContext'; // Importa el hook del contexto

const PantallaPrincipal = ({ route }) => {
    const navigation = useNavigation();
    const { isNightMode } = useTheme(); 
    const [Clave, setClave] = useState('');
    const Usuario = route.params?.usuario1 || '';
    

    const CambiarPassword = async () => {
        try {
            var verificarUrl = `${Ubicacion.API_URL}` + "CambiarPassword.php";
            var obtenerIdUrl = `${Ubicacion.API_URL}` + "obtenerid.php";
            const Password = await fetch(verificarUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Nombre: Usuario, NClave: Clave }) // Cambié NClave a Clave
            });
            const verificarResult = await Password.json();

            const obtenerIdResponse = await fetch(obtenerIdUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ Usuario: Usuario })
            });
            const obtenerIdResult = await obtenerIdResponse.json();

            if (verificarResult === 'éxito') { 
              const usuarioId = obtenerIdResult.id;
              console.log("id: ", usuarioId);
              navigation.navigate('Pantallaempleado', { usuario: Usuario, id: usuarioId, 
              nombre: obtenerIdResult.nombre, foto: obtenerIdResult.foto });
            } else {
                alert('Usuario o Clave Incorrecto');
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: isNightMode ? '#121212' : '#A3D5FF' }]}>
            <Text style={[styles.text, { color: isNightMode ? '#FFFFFF' : '#000000' }]}>Correo Electrónico Recibido: {Usuario}</Text>
            <CampoTexto
                placeholder="Nueva Contraseña"
                maxLength={10}
                secureTextEntry={true} 
                value={Clave}
                setValor={setClave}
                onChangeText={text => setClave(text)}
            />
            <Boton text="Cambiar" ColorFondo={isNightMode ? '#4CAF50' : '#0A3D91'} onPress={CambiarPassword} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
    },
});

export default PantallaPrincipal;