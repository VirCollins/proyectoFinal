import React, { Component } from 'react'
import { Text, View,StyleSheet} from 'react-native'
import Boton from '../componentes/Boton';
import CampoTexto from '../componentes/CampoTexto';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import Ubicacion from '../componentes/Ubicacion';

const PantallaPrincipal  = ({ route }) => {

    const navigation = useNavigation();
    const [Clave, setClave] = useState('');
    const [NClave, NsetClave] = useState('');
    const Usuario = route.params?.usuario1 || '';
  const CambiarPassword = async () => {
      try {
  
          var verificarUrl = `${Ubicacion.API_URL}` + "CambiarPassword.php";
  
          const Password = await fetch(verificarUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ Nombre: Usuario, NClave: NClave })
          });
          const verificarResult = await Password.json();
  
          if (verificarResult == 'éxito') { 
                  navigation.navigate('Pantallaempleado', { usuario: Usuario });
          } else {
              alert('Usuario o Clave Incorrecto');
          }
      } catch (error) {
          alert(error);
      }
  };

    return (
      <View style={styles.container}>
        <Text> Correo Electrónico Recibido: {Usuario}</Text>
        <CampoTexto
                placeholder="Nueva Contraseña"
                maxLength={10}
                secureTextEntry={false}
                value={Clave}
                setValor={setClave}
                onChangeText={text => setClave(text)}
          />
          <CampoTexto
                placeholder="Confirmar contraseña"
                maxLength={10}
                secureTextEntry={false}
                value={NClave}
                setValor={NsetClave}
                onChangeText={text => NsetClave(text)}
          />
          
          <Boton text="Cambiar" ColorFondo='#0A3D91' onPress={CambiarPassword} />
      </View>
    )
  
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default PantallaPrincipal
