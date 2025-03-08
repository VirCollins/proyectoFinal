import { Platform } from 'react-native';
import * as Network from 'expo-network';

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
  if (Platform.OS === 'ios') return "IOS";
  if (Platform.OS === 'android') return "ANDROID";
  if (Platform.OS === 'web') return "WEB";
  return "OTRO";
};

const getDeviceDetails = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  let marca = "Desconocida", modelo = "Desconocido";

  if (/iphone/.test(userAgent)) {
    marca = "Apple";
    modelo = "iPhone";
  } else if (/samsung/.test(userAgent)) {
    marca = "Samsung";
  } else if (/huawei/.test(userAgent)) {
    marca = "Huawei";
  } else if (/xiaomi/.test(userAgent)) {
    marca = "Xiaomi";
  } else if (/oppo/.test(userAgent)) {
    marca = "Oppo";
  }
  return { marca, modelo };
};

const saveBitacora = async (descrip, usuario) => {
  const browser = getBrowser();
  const ip = await getIP();
  const { marca, modelo } = getDeviceDetails();

  try {
    const response = await fetch("http://192.168.100.122/ExamenBacken/backend1/bitacora_save.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario: parseInt(usuario),  // Convertir usuario a número
        navegador: browser,
        ip: ip,
        marca: marca,
        modelo: modelo,
        descrip: descrip
      })
    });

    const result = await response.json();
    console.log("Respuesta del servidor:", result);
  } catch (error) {
    console.error("Error al guardar en bitácora:", error);
  }
};




export default { getIP, getPlatform, getBrowser, getDeviceDetails, saveBitacora };
