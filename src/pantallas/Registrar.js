import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import CampoTexto from '../componentes/CampoTexto';
import Boton from '../componentes/Boton';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import Ubicacion from '../componentes/Ubicacion';

 const Registrar = () => {
    const navigation = useNavigation();
    //const API_URL = "http://192.168.100.122/ExamenBacken/backend1/";

    const [Usuario, setUsuario] = useState('');
    const [Correo, setCorreo] = useState('');
    const [Clave, setClave] = useState('');
    const [RClave, setRClave] = useState('');

    const Crearuser = async () =>
      {
       // alert('Verificando....');
        try{ 
          var url = `${Ubicacion.API_URL}`+"registrar.php";
          const response = await fetch(url,{
            method: 'POST',

            body: JSON.stringify({
              Usuario: Usuario,
              Correo: Correo,
              Clave: Clave,
              RClave: RClave
            })
          })
          const result = await response.json();
          alert(result);
          if(result == 'exito')
            {
              navigation.navigate('Login')
             // alert('Usuario');
            }else{
              alert('Usuario o Clave Incorrecto');
            }
        } catch (error){
          alert(error);
        }

      }


    const iniciar = async () =>
      {
        navigation.navigate('Login')
      }

    return (
      <View style={styles.container}>
        <Text style={[styles.text]}>Crear Una Cuenta</Text>

        <CampoTexto 
                placeholder="Usuario" 
                 maxLength={10}
                 secureTextEntry={false}
                 value={Usuario}
                 setValor={setUsuario}
                 onChangeText = {text => setUsuario(text)}
                 />
        <CampoTexto 
                placeholder="Correo Eletronico" 
                 secureTextEntry={false}
                 value={Correo}
                 setValor={setCorreo}
                 onChangeText = {text => setCorreo(text)}
                 />         
        <CampoTexto 
                placeholder="Clave" 
                 maxLength={10}
                 secureTextEntry={false}
                 value={Clave}
                 setValor={setClave}
                 onChangeText = {text => setClave(text)}
                 />
        <CampoTexto 
                placeholder="Repetir Clave" 
                 maxLength={10}
                 secureTextEntry={false}
                 value={RClave}
                 setValor={setRClave}
                 onChangeText = {text => setRClave(text)}
                 />
         <Boton text="Registrar" ColorFondo='#000' onPress={Crearuser}/> 
         <Text>Al Registrarse, usted esta aceptando nuestros</Text>
         <Text style={[styles.shorttext]}>Terminos de uso y Privacida</Text>
                 <Boton text = "Tiene cuentra, Ingresar" ColorFrente = '#000' onPress={iniciar}/>      
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },text:{
    fontSize:30,
    
  },shorttext:{
    color: '#167270',
  }

});


export default Registrar
