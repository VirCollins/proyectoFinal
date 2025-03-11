import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Button, FlatList, Platform, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const VerBitacora = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  
  const fetchData = (selectedDate) => {
    const formattedDate = selectedDate.getFullYear() + '-' + 
                          String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(selectedDate.getDate()).padStart(2, '0');
    
    setLoading(true);
    var fechaUrl = `http://phpbacken123.whf.bz/ExamenBacken/backend1/bitacora_get.php?fecha=${formattedDate}`;

    fetch(fechaUrl)
      .then((response) => response.json())
      .then((json) => {
        if (json.status === "success") {
          setData(json.data);
        } else {
          Alert.alert("Error", json.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch Error:', err.message);
        setLoading(false);
      });
  };

  const onChange = (event, selectedDate) => {
    setShowPicker(false); // Close picker on Android
    if (selectedDate) {
      setDate(selectedDate);
      fetchData(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <input
          type="date"
          value={date.toISOString().split('T')[0]}
          onChange={(e) => onChange(null, new Date(e.target.value))}
          style={{ padding: 10, fontSize: 16 }}
        />
      ) : (
        <>
          <Button title="Select Date" onPress={() => setShowPicker(true)} />
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}
        </>
      )}
      <Button title="Generar" onPress={() => fetchData(date)} />
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.usuario_id}-${item.bitacora_fecha}-${index}`}
        ListHeaderComponent={() => (
          <View style={{ flexDirection: 'row', padding: 10, backgroundColor: '#ddd' }}>
            <Text style={{ flex: 1, fontWeight: 'bold' }}>Usuario</Text>
            <Text style={{ flex: 2, fontWeight: 'bold' }}>Fecha</Text>
            <Text style={{ flex: 2, fontWeight: 'bold' }}>Descripción</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ flex: 1 }}>{item.usuario_id}</Text>
            <Text style={{ flex: 2 }}>{item.bitacora_fecha}</Text>
            <Text style={{ flex: 2 }}>{item.bitacora_descrip}</Text>
          </View>
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
});

export default VerBitacora;






