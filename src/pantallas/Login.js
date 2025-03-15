import React, { Component, useEffect } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import Logo from '../../assets/perfil.png';
import CampoTexto from '../componentes/CampoTexto';
import Boton from '../componentes/Boton';
import Bitacora from '../componentes/Bitacora';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import Ubicacion from '../componentes/Ubicacion';

const Login = () => {
  const navigation = useNavigation();
  const [Usuario, setUsuario] = useState('');
  const [Clave, setClave] = useState('');
  let n = 0;

  const verificaruser = async () => {
    try {

        var verificarUrl = `${Ubicacion.API_URL}` + "verifusuario.php";

        const verificarResponse = await fetch(verificarUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Usuario: Usuario, Clave: Clave })
        });
        const verificarResult = await verificarResponse.json();

        if (verificarResult == 'exito') { 
                // Aquí pasamos el usuario como parámetro
                navigation.navigate('Pantallaempleado', { usuario: Usuario });
        } else {
            alert('Usuario o Clave Incorrecto');
        }
    } catch (error) {
        alert(error);
    }
};

  

  const Registrar = async () =>
    {
      navigation.navigate('Registrar')
    }

  return (
    <View style={styles.root}>
      <Image source={Logo} />
      <CampoTexto
        placeholder="Usuario"
        maxLength={10}
        secureTextEntry={false}
        value={Usuario}
        setValor={setUsuario}
        onChangeText={text => setUsuario(text)}
      />
      <CampoTexto
        placeholder="Ingrese Clave"
        maxLength={10}
        secureTextEntry={true}
        value={Clave}
        setValor={setClave}
        onChangeText={text => setClave(text)}
      />
      <Boton text="Entrar" ColorFondo='#0A3D91' onPress={verificaruser} />
      <Boton text="Se le olvido la contraseña" ColorFondo='#0A3D91' onPress={Registrar} />
      
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A3D5FF', 
  },
});


export default Login;
