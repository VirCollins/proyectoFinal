import React, { Component } from 'react'
import { Text, View,StyleSheet} from 'react-native'
import Boton from '../componentes/Boton';
import { useNavigation } from '@react-navigation/native';


const PantallaPrincipal  = () => {

    const navigation = useNavigation();
    const reset = async () =>
      {
       navigation.navigate('PantallaReset')
       //alert('funciona')

      }

      const VerBit = async () =>
        {
          navigation.navigate('VerBitacora')
         //alert('funciona')
  
        }
    return (
      <View style={styles.container}>
        <Text> PantallaPrincipal</Text>
        <Boton text = "Entrar" ColorFondo = '#0000ff' onPress={reset}/>
        <Boton text = "Ver Bitacora" ColorFondo = '#0000ff' onPress={VerBit}/>
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
