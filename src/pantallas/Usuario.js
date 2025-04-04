import React, { useState, useEffect } from "react";
import { Image, View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../componentes/ThemeContext'; // Importa el hook del contexto

export default function App() {
    // Variables de estado
    const { isNightMode } = useTheme(); // Usa el contexto para obtener el estado del modo nocturno
    const [modalVisible, setModalVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [identificacion, setIdentificacion] = useState("");
    const [id, setId] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [foto, setFoto] = useState(null);
    const [cargo, setCargo] = useState(""); // Nuevo estado para cargo
    const [users, setUsers] = useState([]); // Estado de usuarios
    const [isEdit, setIsEdit] = useState(false);
    const [currentUser  , setCurrentUser  ] = useState(null);

    // Solicitar permisos para la cámara
    const requestCameraPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        return status === "granted";
    };

    // Obtener usuarios desde el backend
    const fetchUsers = async () => {
        try {
            const response = await fetch("http://arturo.bonaquian.com/ProyectoFinalBacken/usuario.php", {
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
            formData.append("usuario_id", id);
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

            const endpoint = isEdit 
                ? "http://arturo.bonaquian.com/ProyectoFinalBacken/actualizar_usuario.php" 
                : "http://arturo.bonaquian.com/ProyectoFinalBacken/usuario_save.php";

            const response = await fetch(endpoint, {
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
                fetchUsers(); // Refrescar la lista de usuarios
                setFormVisible(false);
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
        setIsEdit(false);
    };

    // Cargar datos del usuario para editar
    const cargarUsuarioParaEditar = async (usuarioId) => {
        try {
            const response = await fetch(`http://arturo.bonaquian.com/ProyectoFinalBacken/usuario.php?usuario_id=${usuarioId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            const usuario = await response.json();
            if (usuario.usuario_id) {
                setId(usuario.usuario_id);
                setIdentificacion(usuario.usuario_identificacion);
                setNombre(usuario.usuario_nombre);
                setApellido(usuario.usuario_apellido);
                setCorreo(usuario.usuario_correo);
                setUsername(usuario.usuario_username);
                setPassword(usuario.usuario_password);
                const urlimg = "http://arturo.bonaquian.com/ProyectoFinalBacken/";
                setFoto(usuario.usuario_foto ? urlimg + usuario.usuario_foto : null);
                setCargo(usuario.usuario_cargo);
                setIsEdit(true);
                setFormVisible(true);
            } else {
                Alert.alert("Error", "Usuario no encontrado.");
            }
        } catch (error) {
            console.error("Error al obtener los datos del usuario:", error);
            Alert.alert("Error", "No se pudo obtener los datos del usuario.");
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: isNightMode ? '#121212' : '#A3D5FF' }]}>
            <Text style={[styles.title, { color: isNightMode ? '#FFFFFF' : '#2A4C7B' }]}>Mantenimiento de Usuarios</Text>

            <Button title="Listar Usuarios" onPress={openUserListModal} />
            <Button title="Nuevo Usuario" onPress={() => {
                limpiarCampos();
                setFormVisible(true);
            }} />
            <View style={styles.space} />

            {/* Modal para listar usuarios */}
            <Modal visible={modalVisible} animationType="slide" transparent={false} onRequestClose={() => setModalVisible(false)}>
                <View style={[styles.modalContainer, { backgroundColor: isNightMode ? '#444' : '#fff' }]}>
                    <Button title="Cerrar" onPress={() => setModalVisible(false)} />
                    <Text style={[styles.modalTitle, { color: isNightMode ? '#fff' : '#000' }]}>Listado de Usuarios</Text>

                    <FlatList
                        style={styles.flatList}
                        data={users}
                        keyExtractor={(item) => item.usuario_id.toString()}
                        ListHeaderComponent={() => (
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableHeaderText, { color: isNightMode ? '#fff' : '#000' }]}>ID</Text>
                                <Text style={[styles.tableHeaderText, { color: isNightMode ? '#fff' : '#000' }]}>Nombre</Text>
                                <Text style={[styles.tableHeaderText, { color: isNightMode ? '#fff' : '#000' }]}>Estado</Text>
                                <Text style={[styles.tableHeaderText, { color: isNightMode ? '#fff' : '#000' }]}>Acciones</Text>
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell, { color: isNightMode ? '#fff' : '#000' }]}>{item.usuario_id}</Text>
                                <Text style={[styles.tableCell, { color: isNightMode ? '#fff' : '#000' }]}>{item.usuario_nombre}</Text>
                                <Text style={[styles.tableCell, { color: isNightMode ? '#fff' : '#000' }]}>{item.usuario_estado}</Text>
                                <View style={styles.tableCell}>
                                    <Button
                                        title="Editar"
                                        onPress={() => cargarUsuarioParaEditar(item.usuario_id)}
                                    />
                                   
                                </View>
                            </View>
                        )}
                    />
                </View>
            </Modal>

            {/* Formulario de Registro o Edición */}
            {formVisible && (
                <View>
                    <TextInput style={[styles.input, { backgroundColor: isNightMode ? '#555' : '#fff', color: isNightMode ? '#fff' : '#000' }]} placeholder="Identificación" value={identificacion} onChangeText={setIdentificacion} keyboardType="numeric" />
                    <TextInput style={[styles.input, { backgroundColor: isNightMode ? '#555' : '#fff', color: isNightMode ? '#fff' : '#000' }]} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
                    <TextInput style={[styles.input, { backgroundColor: isNightMode ? '#555' : '#fff', color: isNightMode ? '#fff' : '#000' }]} placeholder="Apellido" value={apellido} onChangeText={setApellido} />
                    <TextInput style={[styles.input, { backgroundColor: isNightMode ? '#555' : '#fff', color: isNightMode ? '#fff' : '#000' }]} placeholder="Correo" value={correo} onChangeText={setCorreo} keyboardType="email-address" />
                    <TextInput style={[styles.input, { backgroundColor: isNightMode ? '#555' : '#fff', color: isNightMode ? '#fff' : '#000' }]} placeholder="Username" value={username} onChangeText={setUsername} />
                    <TextInput style={[styles.input, { backgroundColor: isNightMode ? '#555' : '#fff', color: isNightMode ? '#fff' : '#000' }]} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />

                    {/* Campo de cargo */}
                    <Picker
                        selectedValue={cargo}
                        onValueChange={(itemValue) => setCargo(itemValue)}
                        style={[styles.seleccion,{color: isNightMode ? '#fff' : '#000'}]}
                    >
                        <Picker.Item label="Selecciona un cargo" value="" />
                        <Picker.Item label="Gerente" value="Gerente" />
                        <Picker.Item label="Doctor" value="Doctor" />
                        <Picker.Item label="Enfermero" value="Enfermero" />
                        <Picker.Item label="Secretario" value="Secretario" />
                    </Picker>

                    <Button title="Tomar Foto" onPress={tomarFoto} />
                    {foto && <Image source={{ uri: foto }} style={styles.foto} />}
                    <View style={styles.space} />
                    <Button title={isEdit ? "Actualizar Usuario" : "Guardar Usuario"} onPress={enviarDatos} />
                </View>
            )}
        </ScrollView>
    );
}

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    space: {
        height: 20,
    },
    input: {
        borderWidth: 2,
        borderColor: "#ccc",
        padding: 10,
        marginTop: 10,
        marginBottom: 5,
        borderRadius: 5,
    },
    modalContainer: {
        flex: 1,
        padding: 20,
    },
    modalTitle: {
        textAlign: "center",
        fontSize: 22,
        marginBottom: 20,
    },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#ccc",
        paddingVertical: 10,
    },
    tableHeaderText: {
        flex: 1,
        textAlign: "center",
        fontWeight: "bold",
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    tableCell: {
        flex: 1,
        textAlign: "center",
    },
    foto: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginVertical: 10,
    },
    seleccion: {
        borderWidth: 5,
        marginTop: 10,
        padding: 10,
        marginBottom: 20,
    },
});