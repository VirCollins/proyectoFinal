import React, { useState, useEffect } from "react";
import { Image, View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { Picker } from '@react-native-picker/picker'; // Importación correcta

export default function App() {
    // Variables de estado
    const [modalVisible, setModalVisible] = useState(false);
    const [identificacion, setIdentificacion] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [foto, setFoto] = useState(null);
    const [cargo, setCargo] = useState(""); // Nuevo estado para cargo
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
        if (!identificacion || !nombre || !apellido || !correo || !username || !password || !foto || !cargo) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }

        try {
            let formData = new FormData();
            formData.append("usuario_identificacion", identificacion);
            formData.append("usuario_nombre", nombre);
            formData.append("usuario_apellido", apellido);
            formData.append("usuario_correo", correo);
            formData.append("usuario_username", username);
            formData.append("usuario_password", password);
            formData.append("usuario_cargo", cargo); // Añadimos el cargo

            // Agregar la imagen al FormData
            const fileName = foto.split('/').pop();
            const fileType = fileName.split('.').pop();
            
            formData.append("usuario_foto", {
                uri: foto,
                name: fileName,
                type: `image/${fileType}`,
            });

            const response = await fetch("http://192.168.100.122/ProyectoFinalBacken/usuario_save.php", {
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
        setIdentificacion("");
        setNombre("");
        setApellido("");
        setCorreo("");
        setUsername("");
        setPassword("");
        setFoto(null);
        setCargo(""); // Limpiamos el cargo
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
                        keyExtractor={(item) => item.usuario_id}
                        ListHeaderComponent={() => (
                            <View style={{ flexDirection: "row", padding: 10, backgroundColor: "#ddd" }}>
                                <Text style={{ flex: 1, fontWeight: "bold" }}>ID</Text>
                                <Text style={{ flex: 2, fontWeight: "bold" }}>Nombre</Text>
                                <Text style={{ flex: 1, fontWeight: "bold" }}>Estado</Text>
                                <Text style={{ flex: 2, fontWeight: "bold" }}>Acciones</Text>
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: "row", padding: 10, borderBottomWidth: 1 }}>
                                <Text style={{ flex: 1 }}>{Number(item.usuario_id)}</Text>
                                <Text style={{ flex: 2 }}>{item.usuario_nombre}</Text>
                                <Text style={{ flex: 1 }}>{item.usuario_estado}</Text>
                                <View style={{ flex: 2 }}>
                                    <Button
                                        title={item.usuario_estado === "ACTIVO" ? "Desactivar" : "Activar"}
                                        onPress={() => toggleUserStatus(item.usuario_id, item.usuario_estado === "ACTIVO" ? "INACTIVO" : "ACTIVO")}
                                    />
                                </View>
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
            <TextInput style={styles.input} placeholder="Identificación" value={identificacion} onChangeText={setIdentificacion} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.input} placeholder="Apellido" value={apellido} onChangeText={setApellido} />
            <TextInput style={styles.input} placeholder="Correo" value={correo} onChangeText={setCorreo} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
            <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />

            {/* Campo de cargo */}
            <Picker
                selectedValue={cargo}
                onValueChange={(itemValue) => setCargo(itemValue)}
                style={styles.input}
            >
                <Picker.Item label="Selecciona un cargo" value="" />
                <Picker.Item label="Gerente" value="Gerente" />
                <Picker.Item label="Doctor" value="Doctor" />
                <Picker.Item label="Enfermero" value="Enfermero" />
                <Picker.Item label="Secretario" value="Secretario" />
            </Picker>

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
