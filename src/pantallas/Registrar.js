import React, { useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import CampoTexto from '../componentes/CampoTexto';
import Boton from '../componentes/Boton';
import { useNavigation } from '@react-navigation/native';
import Ubicacion from '../componentes/Ubicacion';
import { useTheme } from '../componentes/ThemeContext'; // Importa el hook del contexto

const RecuperarPassword = () => {
  const navigation = useNavigation();
  const { isNightMode } = useTheme(); // Usa el contexto para obtener el estado del modo nocturno
  const [correo, setCorreo] = useState('');

  const recuperarContraseña = async () => {
    try {
      const url = `${Ubicacion.API_URL}recuperar_password.php`; // La URL de tu backend PHP
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario_correo: correo }),
      });
      
      const result = await response.json();
      if (result.status === 'success') {
        // Si el correo es encontrado, redirige a la pantalla principal
        Alert.alert('Éxito', result.message);
        navigation.navigate('PantallaPrincipal', {usuario1: result.Nombre}); // Redirige a la pantalla principal
        
      } else {
        // Si el correo no se encuentra
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al procesar tu solicitud.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isNightMode ? '#121212' : '#A3D5FF' }]}>
      <Text style={[styles.text, { color: isNightMode ? '#FFFFFF' : '#000000' }]}>Recuperar Contraseña</Text>

      <CampoTexto
        placeholder="Correo Electrónico"
        secureTextEntry={false}
        value={correo}
        setValor={setCorreo}
        onChangeText={text => setCorreo(text)}
      />

      <Boton text="Recuperar" ColorFondo={isNightMode ? '#4CAF50' : '#0A3D91'} onPress={recuperarContraseña} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 30,
  },
});

export default RecuperarPassword;