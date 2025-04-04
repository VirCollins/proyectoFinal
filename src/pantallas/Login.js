import React, { useState } from 'react';
import { View, Image, StyleSheet, Button } from 'react-native';
import Logo from '../../assets/perfil.png';
import CampoTexto from '../componentes/CampoTexto';
import Boton from '../componentes/Boton';
import { useNavigation } from '@react-navigation/native';
import Ubicacion from '../componentes/Ubicacion';
import { useTheme } from '../componentes/ThemeContext'; 
import Bitacora from '../componentes/Bitacora';

const Login = () => {
  const navigation = useNavigation();
  const { isNightMode, toggleNightMode } = useTheme(); // Usa el contexto para obtener el estado del modo nocturno
  const [Usuario, setUsuario] = useState('');
  const [Clave, setClave] = useState('');
  let n = 0;

  const verificaruser = async () => {
    try {
      var bloqueoUrl = `${Ubicacion.API_URL}` + "bloqueado.php";
      var verificarUrl = `${Ubicacion.API_URL}` + "verifusuario.php";
      var obtenerIdUrl = `${Ubicacion.API_URL}` + "obtenerid.php";

      const bloqueoResponse = await fetch(bloqueoUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Usuario: Usuario })
      });
      const bloqueoResult = await bloqueoResponse.json();

      if (bloqueoResult === 'si esta block') {
        alert('Usuario bloqueado. Por favor contacte al administrador.');
        return;
      }

      const verificarResponse = await fetch(verificarUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Usuario: Usuario, Clave: Clave })
      });

      const responseText = await verificarResponse.text();
      console.log('Respuesta cruda:', responseText);

      const obtenerIdResponse = await fetch(obtenerIdUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Usuario: Usuario, Clave: Clave })
      });
      const obtenerIdResult = await obtenerIdResponse.json();

      // Intentamos parsear la respuesta JSON
      try {
        const verificarResult = JSON.parse(responseText);

        // Verificamos el estado y tomamos la acción correspondiente
        if (verificarResult.status === 'exito') {
          alert(verificarResult.message);
          const usuarioId = obtenerIdResult.id;
          console.log("id: ", usuarioId);
          navigation.navigate('Pantallaempleado', { usuario: Usuario, id: usuarioId, 
            nombre: obtenerIdResult.nombre, foto: obtenerIdResult.foto });
           Bitacora.saveBitacora("ingreso al sistema",Usuario);
        } else if (verificarResult.status === 'succes') {
          alert(verificarResult.message);
          const usuarioId = obtenerIdResult.id;
          console.log("id: ", usuarioId);
          navigation.navigate('Pantallaempleado', { usuario: Usuario, id: usuarioId, 
            nombre: obtenerIdResult.nombre, foto: obtenerIdResult.foto });
           Bitacora.saveBitacora("ingreso al sistema",Usuario);
        } else {
          n++;
          alert("usuario o clave incorrecto");
          if (n >= 3) {
            await fetch(bloqueoUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ Usuario: Usuario, bloquear: true })
            });
            alert('Ha alcanzado el máximo de intentos fallidos. Su cuenta ha sido bloqueada.');
            Bitacora.saveBitacora("La cuenta ha sido Bloqueada",Usuario);
          }
        }
      } catch (jsonError) {
        console.error('Error al parsear JSON:', jsonError);
        alert('La respuesta del servidor no es un JSON válido.');
      }

    } catch (error) {
      console.error('Error al verificar usuario:', error);
      alert('Hubo un error al verificar el usuario');
    }
  };

  const Registrar = async () => {
    navigation.navigate('Registrar');
  };

  return (
    <View style={[styles.root, { backgroundColor: isNightMode ? '#121212' : '#A3D5FF' }]}> 
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
    <Boton text="Se le olvidó la contraseña" ColorFondo='#0A3D91' onPress={Registrar} />
    <Boton text="Cambiar Modo" ColorFondo='#0A3D91' onPress={toggleNightMode} /> 
  </View>
);
};

const styles = StyleSheet.create({
root: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
});

export default Login;