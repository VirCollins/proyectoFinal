import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Linking } from "react-native";
import { useTheme } from '../componentes/ThemeContext'; // Importa el hook del contexto

const Reporte_Cita = () => {
    const { isNightMode } = useTheme(); // Usa el contexto para obtener el estado del modo nocturno
    const [citas, setCitas] = useState([]);

    useEffect(() => {
        fetchCitas();
    }, []);

    const fetchCitas = async () => {
        try {
            const response = await fetch("http://arturo.bonaquian.com/ProyectoFinalBacken/cita.php");
            const result = await response.json();
            setCitas(result);
        } catch (error) {
            Alert.alert("Error", "No se pudieron obtener las citas");
        }
    };

    const openPdf = (cita_id) => {
        const pdfUrl = `http://arturo.bonaquian.com/ProyectoFinalBacken/ReporteCita.php?cita_id=${cita_id}`;
        Linking.openURL(pdfUrl).catch(() => {
            Alert.alert("Error", "No se pudo abrir el PDF");
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: isNightMode ? '#121212' : '#fff' }]}>
            <Text style={[styles.title, { color: isNightMode ? '#FFFFFF' : '#000000' }]}>Lista de Citas</Text>
            <FlatList
                data={citas}
                keyExtractor={(item) => item.cita_id.toString()} // Asegúrate de que cita_id sea único
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.citaItem} onPress={() => openPdf(item.cita_id)}>
                        <Text style={{ color: isNightMode ? '#FFFFFF' : '#000000' }}>{item.cita_nombre}</Text> 
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
    citaItem: { padding: 10, borderBottomWidth: 1 },
});

export default Reporte_Cita;