import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import CampoTexto from '../componentes/CampoTexto';
import Boton from '../componentes/Boton';
import Ubicacion from '../componentes/Ubicacion';
import { useTheme } from '../componentes/ThemeContext'; // Importa el hook del contexto
import Bitacora from '../componentes/Bitacora';

const PantallaReset = () => {
  const { isNightMode } = useTheme(); // Usa el contexto para obtener el estado del modo nocturno
  const [Usuario, setUsuario] = useState('');

  const desbloqueo = async () => {
    try {
      var url = `${Ubicacion.API_URL}` + "desbloquear.php";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Usuario: Usuario,
        }),
      });
      const result = await response.json();
      console.log(result);
      if (result === 'El usuario está ACTIVO') {
        alert('El usuario ya está activo');
      } else if (result === 'd') {
        alert('El usuario ha sido desbloqueado');
        // Navegar a la pantalla principal
        // navigation.navigate('PantallaPrincipal');
        Bitacora.saveBitacora("La cuenta ha sido desbloqueada",Usuario);
      } else if (result === 'n') {
        alert('Usuario no existe');
      } else {
        alert('Error desconocido');
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: isNightMode ? '#121212' : '#A3D5FF' }]}>
      <Text style={[styles.titulo, { color: isNightMode ? '#FFFFFF' : '#0A3D91' }]}>Ingrese un usuario</Text>
      <CampoTexto
        placeholder="Usuario"
        maxLength={10}
        secureTextEntry={false}
        value={Usuario}
        setValor={setUsuario}
        onChangeText={(text) => setUsuario(text)}
      />
      <Boton text="Entrar" ColorFondo={isNightMode ? '#4CAF50' : '#0A3D91'} onPress={desbloqueo} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default PantallaReset;