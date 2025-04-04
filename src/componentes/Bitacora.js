import { Platform } from 'react-native';
import * as Network from 'expo-network';
import * as Location from 'expo-location'; // Importar la librería de ubicación
import URL from '../componentes/Ubicacion'; // Asegúrate de que esta URL esté configurada correctamente

const getIP = async () => {
  try {
    const ip = await Network.getIpAddressAsync();
    return ip;
  } catch (error) {
    console.error("Error obteniendo IP local:", error);
    return "Desconocida";
  }
};

const getBrowser = () => {
  if (Platform.OS !== 'web') return getPlatform();

  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Google Chrome';
  if (userAgent.includes('Firefox')) return 'Mozilla Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Apple Safari';
  if (userAgent.includes('Edg')) return 'Microsoft Edge';
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';
  if (userAgent.includes('Trident') || userAgent.includes('MSIE')) return 'Internet Explorer';

  return 'Navegador desconocido';
};

const getPlatform = () => {
  var platform = "bitacora";
  if (Platform.OS === 'ios') platform = "IOS";
  else if (Platform.OS === 'android') platform = "ANDROID";
  else if (Platform.OS === 'web') platform = "WEB";
  return platform;
};

// Obtener la IP pública utilizando una API externa
const getPublicIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error obteniendo IP pública:", error);
    return "Desconocida";
  }
};

// Obtener la ubicación actual
const getCurrentLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.error('Permiso de ubicación denegado');
    return null;
  }

  const location = await Location.getCurrentPositionAsync({});
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};

const saveBitacora = async (descrip, usuario) => {
  try {
      const browser = getBrowser();
      const ipLocal = await getIP();
      const ipPublica = await getPublicIP();
      const location = await getCurrentLocation(); // Obtener la ubicación actual

      if (!location) {
          alert('No se pudo obtener la ubicación actual.');
          return;
      }

      // Enviar los datos al servidor
      var url = "http://arturo.bonaquian.com/ProyectoFinalBacken/bitacora_save.php"; // Cambia esto a tu URL
      const response = await fetch(url, {
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              usuario: usuario, // Usuario
              descrpcion: descrip, // Descripción del evento
              navegador: browser, // Navegador
              ip: ipPublica, // IP pública
              gps: {
                  latitude: location.latitude,
                  longitude: location.longitude,
              }
          }),
      });

      const result = await response.json();
      console.log("Resultado de la respuesta:", result);

      // Verificar el resultado
      /*if (result.success) {
          alert('Bitácora guardada exitosamente.');
      } else {
          alert(`Error al registrar en la bitácora: ${result.message || 'Respuesta inesperada'}`);
      }*/
  } catch (error) {
      console.error("Error al guardar en la bitácora:", error);
      alert(`Error al guardar en la bitácora: ${error.message}`);
  }
};

export default { getIP, getPlatform, getBrowser, saveBitacora };