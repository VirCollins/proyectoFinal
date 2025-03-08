import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import CampoTexto from '../componentes/CampoTexto';
import Boton from '../componentes/Boton';
import Ubicacion from '../componentes/Ubicacion';

const PantallaReset = () => {
  //const API_URL = "http://192.168.100.122/ExamenBacken/backend1/";
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
      } else if (result === 'El usuario estaba BLOQUEADO y ha sido desbloqueado') {
        alert('El usuario ha sido desbloqueado');
        // Navegar a la pantalla principal
        // navigation.navigate('PantallaPrincipal');
      } else if (result === 'Usuario no existe') {
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
    <View style={styles.root}>
      <CampoTexto
        placeholder="Usuario"
        maxLength={10}
        secureTextEntry={false}
        value={Usuario}
        setValor={setUsuario}
        onChangeText={(text) => setUsuario(text)}
      />
      <Boton text="Entrar" ColorFondo='#0000ff' onPress={desbloqueo} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default PantallaReset;

