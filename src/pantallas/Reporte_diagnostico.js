import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Linking } from "react-native";
import { useTheme } from '../componentes/ThemeContext'; // Importa el hook del contexto

const Reporte_diagnostico = () => {
    const { isNightMode } = useTheme(); // Usa el contexto para obtener el estado del modo nocturno
    const [diagnosticos, setDiagnosticos] = useState([]);

    useEffect(() => {
        fetchDiagnosticos();
    }, []);

    const fetchDiagnosticos = async () => {
        try {
            const response = await fetch("http://arturo.bonaquian.com/ProyectoFinalBacken/dianostico.php");
            const result = await response.json();
            setDiagnosticos(result);
        } catch (error) {
            Alert.alert("Error", "No se pudieron obtener los diagnósticos");
        }
    };

    const openPdf = (dianostico_id) => {
        const pdfUrl = `http://arturo.bonaquian.com/ProyectoFinalBacken/ReporteDianostico.php?dianostico_id=${dianostico_id}`;
        Linking.openURL(pdfUrl).catch(() => {
            Alert.alert("Error", "No se pudo abrir el PDF");
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: isNightMode ? '#121212' : '#fff' }]}>
            <Text style={[styles.title, { color: isNightMode ? '#FFFFFF' : '#000000' }]}>Lista de Diagnósticos</Text>
            <FlatList
                data={diagnosticos}
                keyExtractor={(item) => item.dianostico_id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.diagnosticoItem} onPress={() => openPdf(item.dianostico_id)}>
                        <Text style={{ color: isNightMode ? '#FFFFFF' : '#000000' }}>{item.dianostico_descrip}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
    diagnosticoItem: { padding: 10, borderBottomWidth: 1 },
});

export default Reporte_diagnostico;