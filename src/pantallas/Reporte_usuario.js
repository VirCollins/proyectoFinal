import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Linking } from "react-native";
import { useTheme } from '../componentes/ThemeContext'; // Importa el hook del contexto

const Reporte_usuario = () => {
    const { isNightMode } = useTheme(); // Usa el contexto para obtener el estado del modo nocturno
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const response = await fetch("http://arturo.bonaquian.com/ProyectoFinalBacken/usuario.php");
            const result = await response.json();
            setUsuarios(result);
        } catch (error) {
            Alert.alert("Error", "No se pudieron obtener los usuarios");
        }
    };

    const openPdf = (usuario_id) => {
        const pdfUrl = `http://arturo.bonaquian.com/ProyectoFinalBacken/DatosUsuario.php?usuario_id=${usuario_id}`;
        Linking.openURL(pdfUrl).catch(() => {
            Alert.alert("Error", "No se pudo abrir el PDF");
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: isNightMode ? '#121212' : '#fff' }]}>
            <Text style={[styles.title, { color: isNightMode ? '#FFFFFF' : '#000000' }]}>Lista de Usuarios</Text>
            <FlatList
                data={usuarios}
                keyExtractor={(item) => item.usuario_id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.userItem} onPress={() => openPdf(item.usuario_id)}>
                        <Text style={{ color: isNightMode ? '#FFFFFF' : '#000000' }}>{item.usuario_nombre}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
    userItem: { padding: 10, borderBottomWidth: 1 },
});

export default Reporte_usuario;