import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";

const AsignarModulos = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [modulos, setModulos] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [nombreUsuario, setNombreUsuario] = useState("");

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

    const fetchModulos = async (usuario_id, usuario_nombre) => {
        try {
            const response = await fetch(`http://arturo.bonaquian.com/ProyectoFinalBacken/Acceso.php?usuario_id=${usuario_id}`);
            const result = await response.json();
            setModulos(result);
            setUsuarioSeleccionado(usuario_id);
            setNombreUsuario(usuario_nombre);
        } catch (error) {
            Alert.alert("Error", "No se pudieron obtener los módulos");
        }
    };

    const toggleAcceso = async (usuario_id, modulo_codigo, acceso_estado) => {
        try {
            const nuevoEstado = acceso_estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
            const response = await fetch("http://arturo.bonaquian.com/ProyectoFinalBacken/Acceso.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ usuario_id, modulo_codigo, nuevo_estado: nuevoEstado }).toString(),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
    
            const result = await response.json();
    
            if (result.status === "success") {
                fetchModulos(usuario_id, nombreUsuario);
            } else {
                Alert.alert("Error", result.message);
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar el acceso");
            console.error("Error en toggleAcceso:", error);
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Asignar Módulos</Text>
            <FlatList
                data={usuarios}
                keyExtractor={(item) => item.usuario_id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.userItem} onPress={() => fetchModulos(item.usuario_id, item.usuario_nombre)}>
                        <Text>{item.usuario_nombre}</Text>
                    </TouchableOpacity>
                )}
            />

            {usuarioSeleccionado && (
                <View>
                    <Text style={styles.subtitle}>Módulos de {nombreUsuario}</Text>
                    <FlatList
                        data={modulos}
                        keyExtractor={(item) => item.modulo_codigo.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.accesoItem, item.acceso_estado === "ACTIVO" ? styles.activo : styles.inactivo]}
                                onPress={() => toggleAcceso(usuarioSeleccionado, item.modulo_codigo, item.acceso_estado)}
                            >
                                <Text>{item.modulo_nombre} - {item.acceso_estado}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
    subtitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10, textAlign: "center" },
    userItem: { padding: 10, borderBottomWidth: 1 },
    accesoItem: { padding: 10, marginVertical: 5, borderRadius: 5 },
    activo: { backgroundColor: "green", color: "white" },
    inactivo: { backgroundColor: "red", color: "white" }
});

export default AsignarModulos;

