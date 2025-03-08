import React, { useState, useEffect } from "react";
import { Image, View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import Bitacora from "../componentes/Bitacora";
export default function App() {
    // Variables de estado
    const [modalVisible, setModalVisible] = useState(false);
    const [dni, setDNI] = useState("");
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [correo, setCorreo] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [foto, setFoto] = useState(null);
    const [users, setUsers] = useState([]); // Estado de usuarios
    const [page, setPage] = useState(1);

    const pageSize = 10; // Número de usuarios por página

    // Solicitar permisos para la cámara
    const requestCameraPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        return status === "granted";
    };

    // Obtener usuarios desde el backend
    const fetchUsers = async () => {
        try {
            const response = await fetch("http://phpbacken123.whf.bz/ExamenBacken/backend1/usuario.php", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();
            if (Array.isArray(result)) {
                setUsers(result); // Actualizar la lista de usuarios
            } else {
                Alert.alert("Error", "No se pudieron obtener los usuarios.");
            }
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            Alert.alert("Error", "No se pudo conectar al servidor.");
        }
    };

    // Activar o desactivar usuario
    const toggleUserStatus = async (usuario_id, nuevo_estado) => {
        try {
            const response = await fetch("http://phpbacken123.whf.bz/ExamenBacken/backend1/usuario.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    usuario_id,
                    nuevo_estado,
                }),
            });
            Bitacora.saveBitacora("el usuario ha sido "+nuevo_estado,usuario_id);
            const result = await response.json();
            if (result.status === "success") {
                Alert.alert("Éxito", result.message);
                fetchUsers(); // Refrescar la lista de usuarios
            } else {
                Alert.alert("Error", result.message);
            }
        } catch (error) {
            console.error("Error al actualizar el estado del usuario:", error);
            Alert.alert("Error", "No se pudo actualizar el estado del usuario.");
        }
    };

    // Paginación de usuarios
    const paginatedUsers = users.slice(0, page * pageSize);

    // Mostrar usuarios al abrir el modal
    const openUserListModal = () => {
        fetchUsers(); // Obtener usuarios desde el servidor
        setModalVisible(true);
    };

    // Tomar foto con la cámara
    const tomarFoto = async () => {
        const hasPermission = await requestCameraPermission();

        if (!hasPermission) {
            Alert.alert("Error", "Se necesitan permisos para acceder a la cámara.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setFoto(result.assets[0].uri);
            Alert.alert("Éxito", "Foto tomada correctamente");
        } else {
            Alert.alert("Info", "El usuario canceló la toma de foto");
        }
    };

    // Enviar datos al servidor
    const enviarDatos = async () => {
        if (!dni || !nombres || !apellidos || !correo || !username || !password || !foto) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }
    
        try {
            let formData = new FormData();
            formData.append("dni", dni);
            formData.append("nombres", nombres);
            formData.append("apellidos", apellidos);
            formData.append("correo", correo);
            formData.append("username", username);
            formData.append("password", password);
    
            // Agregar la imagen al FormData
            const fileName = foto.split('/').pop();
            const fileType = fileName.split('.').pop();
            
            formData.append("foto", {
                uri: foto,
                name: fileName,
                type: `image/${fileType}`,
            });
    
            const response = await fetch("http://phpbacken123.whf.bz/ExamenBacken/backend1/usuario_save.php", {
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                body: formData,
            });
    
            const result = await response.json();
            console.log("Respuesta del servidor:", result);
    
            if (result.status === "success") {
                Alert.alert("Éxito", result.message);
                limpiarCampos();
            } else {
                Alert.alert("Error", result.message);
            }
        } catch (error) {
            console.error("Error al enviar los datos:", error);
            Alert.alert("Error", "No se pudo conectar con el servidor");
        }
    };

    // Limpiar formulario después del registro
    const limpiarCampos = () => {
        setDNI("");
        setNombres("");
        setApellidos("");
        setCorreo("");
        setUsername("");
        setPassword("");
        setFoto(null);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Mantenimiento de Usuarios</Text>

            <Button title="Listar Usuarios" onPress={openUserListModal} />
            <View style={styles.space} />

            {/* Modal para listar usuarios */}
            <Modal visible={modalVisible} animationType="slide" transparent={false} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <Button title="Cerrar" onPress={() => setModalVisible(false)} />
                    <Text style={styles.modalTitle}>Listado de Usuarios</Text>

                    <FlatList
                        style={styles.flatList}
                        data={paginatedUsers}
                        keyExtractor={(item) => item.usuario_id.toString()}
                        ListHeaderComponent={() => (
                            <View style={{ flexDirection: "row", padding: 10, backgroundColor: "#ddd" }}>
                                <Text style={{ flex: 1, fontWeight: "bold" }}>Usuario</Text>
                                <Text style={{ flex: 1, fontWeight: "bold" }}>Estado</Text>
                                <Text style={{ flex: 1, fontWeight: "bold" }}>Acciones</Text>
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: "row", padding: 10, borderBottomWidth: 1 }}>
                                <Text style={{ flex: 1 }}>{item.usuario_nombre}</Text>
                                <Text style={{ flex: 1 }}>{item.usuario_estado}</Text>
                                <Text style={{ flex: 1 }}>
                                    <Button
                                        title={item.usuario_estado === "ACTIVO" ? "Desactivar" : "Activar"}
                                        onPress={() => toggleUserStatus(item.usuario_id, item.usuario_estado === "ACTIVO" ? "INACTIVO" : "ACTIVO")}
                                    />
                                </Text>
                            </View>
                        )}
                    />

                    {paginatedUsers.length < users.length && (
                        <TouchableOpacity style={styles.loadMore} onPress={() => setPage(page + 1)}>
                            <Text style={styles.loadMoreText}>Cargar más</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Modal>

            {/* Formulario de Registro */}
            <TextInput style={styles.input} placeholder="DNI" value={dni} onChangeText={setDNI} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Nombres" value={nombres} onChangeText={setNombres} />
            <TextInput style={styles.input} placeholder="Apellidos" value={apellidos} onChangeText={setApellidos} />
            <TextInput style={styles.input} placeholder="Correo" value={correo} onChangeText={setCorreo} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
            <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />

            <Button title="Tomar Foto" onPress={tomarFoto} />
            {foto && <Image source={{ uri: foto }} style={{ width: 200, height: 200, marginTop: 20 }} />}
            <View style={styles.space} />
            <Button title="Guardar" onPress={enviarDatos} />
        </ScrollView>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    space: {
        height: 20, // Espacio vertical entre los botones
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    loadMore: {
        backgroundColor: "#007bff",
        padding: 10,
        alignItems: "center",
        marginTop: 10,
        borderRadius: 5,
    },
    loadMoreText: {
        color: "#fff",
        fontWeight: "bold",
    },
    title: {
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    modalContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    flatList: {
        flex: 1,
    },
    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
});
