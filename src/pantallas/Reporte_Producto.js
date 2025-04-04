import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Linking } from "react-native";
import { useTheme } from '../componentes/ThemeContext'; // Importa el hook del contexto

const Reporte_Producto = () => {
    const { isNightMode } = useTheme(); // Usa el contexto para obtener el estado del modo nocturno
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const response = await fetch("http://arturo.bonaquian.com/ProyectoFinalBacken/producto.php");
            const result = await response.json();
            setProductos(result);
        } catch (error) {
            Alert.alert("Error", "No se pudieron obtener los productos");
        }
    };

    const openPdf = (producto_codigo) => {
        const pdfUrl = `http://arturo.bonaquian.com/ProyectoFinalBacken/ReporteProducto.php?producto_codigo=${producto_codigo}`;
        Linking.openURL(pdfUrl).catch(() => {
            Alert.alert("Error", "No se pudo abrir el PDF");
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: isNightMode ? '#121212' : '#fff' }]}>
            <Text style={[styles.title, { color: isNightMode ? '#FFFFFF' : '#000000' }]}>Lista de Productos</Text>
            <FlatList
                data={productos}
                keyExtractor={(item) => item.producto_codigo.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.productItem} onPress={() => openPdf(item.producto_codigo)}>
                        <Text style={{ color: isNightMode ? '#FFFFFF' : '#000000' }}>{item.producto_nombre}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
    productItem: { padding: 10, borderBottomWidth: 1 },
});

export default Reporte_Producto;