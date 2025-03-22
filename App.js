import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './src/pantallas/Login';
import PantallaPrincipal from './src/pantallas/PantallaPrincipal';
import Registrar from './src/pantallas/Registrar';
import PantallaReset from './src/pantallas/PantallaReset';
import Pantallaempleado from './src/pantallas/Pantallaempleado';
import Cargando from './src/pantallas/cargando';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import VerBitacora from './src/pantallas/VerBitacora';
import Principal from './src/pantallas/Principal';
import Usuario from './src/pantallas/Usuario';
import GPS from './src/pantallas/GPS';
import AsignarModulos from './src/pantallas/AsignarModulos';
import Productos from './src/pantallas/Productos';
import Cita from './src/pantallas/Cita';
import Dianostico from './src/pantallas/Dianostico'

const Stack = createNativeStackNavigator();

export default function App() {
  const [cargando, setCargando] = useState(true); 
  useEffect(() => {
    setTimeout(() => {
      setCargando(false);
    }, 2000);
  }, []); 

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {cargando ? (
          <Stack.Screen name="cargando" component={Cargando} /> 
        ) : (
          <Stack.Screen name="Login" component={Login} options={{ title: 'Welcome' }} />
        )}
        
        <Stack.Screen name="PantallaPrincipal" component={PantallaPrincipal} />
        <Stack.Screen name="VerBitacora" component={VerBitacora} />
        <Stack.Screen name="Pantallaempleado" component={Pantallaempleado} />
        <Stack.Screen name='Registrar' component={Registrar} />
        <Stack.Screen name="Principal" component={Principal} />
        <Stack.Screen name="PantallaReset" component={PantallaReset} />
        <Stack.Screen name="Usuario" component={Usuario} />
        <Stack.Screen name="GPS" component={GPS} />
        <Stack.Screen name="AsignarModulos" component={AsignarModulos}/>
        <Stack.Screen name="Productos" component={Productos}/> 
        <Stack.Screen name="Cita" component={Cita}/>
        <Stack.Screen name="Dianostico" component={Dianostico}/> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


