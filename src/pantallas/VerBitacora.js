import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '../componentes/ThemeContext'; // Importa el hook del contexto

const VerBitacora = () => {
  const navigation = useNavigation();
  const { isNightMode } = useTheme();
  const [data, setData] = useState([]);
  const [date, setDate] = useState(new Date());

  const fetchData = (selectedDate) => {
    const formattedDate = selectedDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    console.log("Fetching data for date:", formattedDate); // Log para depuración
  
    const fechaUrl = `http://arturo.bonaquian.com/ProyectoFinalBacken/bitacora_get.php?fecha=${formattedDate}`;
  
    fetch(fechaUrl)
      .then((response) => response.json())
      .then((json) => {
        console.log("Response from API:", json); // Log para depuración
        if (json.status === "success") {
          setData(json.data);
        } else {
          Alert.alert("Error", json.message);
        }
      })
      .catch((err) => {
        console.error('Fetch Error:', err.message);
        Alert.alert("Error", "No se pudo obtener los datos.");
      });
  };
  const handleDayPress = (day) => {
    const selectedDate = new Date(day.dateString);
    setDate(selectedDate);
    fetchData(selectedDate); // Llama a fetchData con la fecha seleccionada
  };

  const handleItemPress = (item) => {
    navigation.navigate('GPSHistorico', {
      latitude: item.bitacora_latitude,
      longitude: item.bitacora_longitude,
      usuario: item.usuario_id,
      descripcion: item.bitacora_descrip,
      fecha: item.bitacora_fecha,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: isNightMode ? '#121212' : '#A3D5FF' }]}>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            [date.toISOString().split('T')[0]]: { selected: true, marked: true, selectedColor: 'blue' }
          }}
          theme={{
            backgroundColor: isNightMode ? '#121212' : '#ffffff',
            calendarBackground: isNightMode ? '#121212' : '#ffffff',
            textSectionTitleColor: isNightMode ? '#ffffff' : '#000000',
            selectedDayBackgroundColor: 'blue',
            selectedDayTextColor: '#ffffff',
            todayTextColor: 'red',
            dayTextColor: isNightMode ? '#ffffff' : '#000000',
            textDisabledColor: '#d9e1e8',
            monthTextColor: isNightMode ? '#ffffff' : '#000000',
            indicatorColor: 'blue',
          }}
        />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.usuario_id}-${item.bitacora_fecha}-${index}`}
        ListHeaderComponent={() => (
          <View style={[{ flexDirection: 'row', padding: 10, backgroundColor: isNightMode ? '#444' : '#ddd' }]}>
            <Text style={[{ flex: 1, fontWeight: 'bold', color: isNightMode ? '#fff' : '#000' }]}>Usuario</Text>
            <Text style={[{ flex: 2, fontWeight: 'bold', color: isNightMode ? '#fff' : '#000' }]}>Fecha</Text>
            <Text style={[{ flex: 2, fontWeight: 'bold', color: isNightMode ? '#fff' : '#000' }]}>Descripción</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View style={[{ flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderColor: isNightMode ? '#555' : '#eee' }]}>
              <Text style={{ flex: 1, color: isNightMode ? '#fff' : '#000' }}>{item.usuario_id}</Text>
              <Text style={{ flex: 2, color: isNightMode ? '#fff' : '#000' }}>{item.bitacora_fecha}</Text>
              <Text style={{ flex: 2, color: isNightMode ? '#fff' : '#000' }}>{item.bitacora_descrip}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  calendarContainer: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5, // Para Android
    shadowColor: '#000', // Para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default VerBitacora;