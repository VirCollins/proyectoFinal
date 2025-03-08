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
        var bloqueoUrl = `${Ubicacion.API_URL}` + "bloqueado.php";
        var verificarUrl = `${Ubicacion.API_URL}` + "verifusuario.php";
        var obtenerIdUrl = `${Ubicacion.API_URL}`+"obtenerid.php";

        const bloqueoResponse = await fetch(bloqueoUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Usuario: Usuario })
        });
        const bloqueoResult = await bloqueoResponse.json();

        if (bloqueoResult == 'si esta block') {
            alert('Usuario bloqueado. Por favor contacte al administrador.');
            return;
        }

        const verificarResponse = await fetch(verificarUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Usuario: Usuario, Clave: Clave })
        });
        const verificarResult = await verificarResponse.json();

        const obtenerIdResponse = await fetch(obtenerIdUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Usuario: Usuario, Clave: Clave })
        });
        const obtenerIdResult = await obtenerIdResponse.json();

        if (verificarResult == 'exito') {
            if (Usuario == 'ilsw') {
                navigation.navigate('Principal');
            } else {
                navigation.navigate('Pantallaempleado');
            }
            
          if (obtenerIdResult.exito) {
            const usuarioId = obtenerIdResult.id;
           // Bitacora.saveBitacora("Ingresando al sistema", usuarioId);
          } else {
            console.log("Error al obtener el ID:", obtenerIdResult.mensaje);
          }
        } else {
            alert('Usuario o Clave Incorrecto');
            n++;
            if (n >= 3) {
                await fetch(bloqueoUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Usuario: Usuario, bloquear: true })
                });
                alert('Ha alcanzado el máximo de intentos fallidos. Su cuenta ha sido bloqueada.');
                const usuarioId = obtenerIdResult.id;
               // Bitacora.saveBitacora("La cuenta ha sido Bloqueada", usuarioId);
            }
        }
    } catch (error) {
        alert(error);
    }
};
  

  const Registrar = async () =>
    {
      navigation.navigate('Usuario')
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
      <Boton text="Entrar" ColorFondo='#0000ff' onPress={verificaruser} />
      <Boton text="registrar" ColorFondo='#0000ff' onPress={Registrar} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default Login;
