import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
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
import Dianostico from './src/pantallas/Dianostico';
import Reporte from './src/pantallas/Reporte';
import Reporte_usuario from './src/pantallas/Reporte_usuario';
import Reporte_Producto from './src/pantallas/Reporte_Producto';
import Reporte_Cita from './src/pantallas/Reporte_Cita';
import Reporte_Diagnostico from './src/pantallas/Reporte_diagnostico';
import GPSHistorico from './src/pantallas/GPSHistorico';
import { ThemeProvider } from './src/componentes/ThemeContext'; // Asegúrate de que la ruta sea correcta

const Stack = createNativeStackNavigator();

export default function App() {
  const [cargando, setCargando] = useState(true); 
  useEffect(() => {
    setTimeout(() => {
      setCargando(false);
    }, 2000);
  }, []); 

  return (
    <ThemeProvider> 
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
          <Stack.Screen name="Reporte" component={Reporte}/>
          <Stack.Screen name="Reporte_usuario" component={Reporte_usuario}/> 
          <Stack.Screen name="Reporte_Producto" component={Reporte_Producto}/>
          <Stack.Screen name="Reporte_Cita" component={Reporte_Cita}/>
          <Stack.Screen name="Reporte_Diagnostico" component={Reporte_Diagnostico}/>
          <Stack.Screen name="GPSHistorico" component={GPSHistorico}/> 
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },});
