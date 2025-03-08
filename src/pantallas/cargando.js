import React from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';

const Cargando = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../../assets/perfil.png")} />
      <Text style={styles.loading}>CARGANDO</Text>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  loading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#169bbf',
    marginBottom: 10,
  },
});

export default Cargando; // Asegúrate de que la exportación sea correcta

