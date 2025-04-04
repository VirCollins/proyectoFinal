import React, { useState, useEffect } from "react";
import { Image, View, TextInput, Button, FlatList, Text, StyleSheet, Modal, ScrollView, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker'; 
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { useTheme } from '../componentes/ThemeContext'; // Importa el hook del contexto
import Bitacora from '../componentes/Bitacora';

export default function Cita() {
    const { isNightMode } = useTheme(); // Usa el contexto para obtener el estado del modo nocturno
    const [modalVisible, setModalVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [identificacion, setIdentificacion] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [telefono, setTelefono] = useState(""); 
    const [fecha, setFecha] = useState(new Date()); 
    const [hora, setHora] = useState(new Date()); 
    const [citaEstado, setCitaEstado] = useState(""); 
    const [usuarioId, setUsuarioId] = useState(""); 
    const [enfermero, setEnfermero] = useState(""); 
    const [usuarios, setUsuarios] = useState([]); 
    const [enfermeros, setEnfermeros] = useState([]); 
    const [showDatePicker, setShowDatePicker] = useState(false); 
    const [showTimePicker, setShowTimePicker] = useState(false); 
    const [cita, setCita] = useState([]);
    const [citaid, setCitaId] = useState([]); 
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                const response = await fetch("http://arturo.bonaquian.com/ProyectoFinalBacken/obtener_Doctor.php");
                const data = await response.json();
                setUsuarios(data);
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
                Alert.alert("Error", "No se pudo cargar la lista de usuarios");
            }
        };

        const cargarEnfermero = async () => {
            try {
                const response = await fetch("http://arturo.bonaquian.com/ProyectoFinalBacken/obtener_enfermeros.php");
                const data = await response.json();
                setEnfermeros(data);
            } catch (error) {
                console.error("Error al cargar enfermeros:", error);
                Alert.alert("Error", "No se pudo cargar la lista de enfermeros");
            }
        };
        
        cargarUsuarios();
        cargarEnfermero();
        fetchCita();
    }, []);

    const enviarDatos = async () => {
        if (!identificacion || !nombre || !apellido || !telefono || !usuarioId || !enfermero || !citaEstado) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }
    
        try {
            const endpoint = isEdit
                ? "http://arturo.bonaquian.com/ProyectoFinalBacken/cita_update.php"
                : "http://arturo.bonaquian.com/ProyectoFinalBacken/cita_save.php";
    
            let formData = new FormData();
            formData.append("cita_id", citaid);  // Solo para la actualización
            formData.append("cita_identificacion", identificacion);
            formData.append("cita_nombre", nombre);
            formData.append("cita_apellido", apellido);
            formData.append("cita_telefono", telefono);
            formData.append("usuario_id", usuarioId);
            formData.append("cita_enfermero", enfermero);
            formData.append("cita_fecha", fecha.toISOString().split('T')[0]);  // Formato YYYY-MM-DD
            formData.append("cita_hora", hora.toTimeString().split(' ')[0].slice(0, 5));  // Formato HH:MM
            formData.append("cita_estado", citaEstado);
    
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {                "Content-Type": "multipart/form-data",
                },
                body: formData,
            });
    
            const result = await response.json();
            if (result.status === "success") {
                Alert.alert("Éxito", result.message);
                limpiarCampos();
                setIsEdit(false); // Resetear el estado de edición
                Bitacora.saveBitacora("Cita recibido",nombre);
            } else {
                Alert.alert("Error", result.message);
            }
        } catch (error) {
            console.error("Error al enviar los datos:", error);
            Alert.alert("Error", "No se pudo conectar con el servidor");
        }
    };

    const limpiarCampos = () => {
        setIdentificacion("");
        setNombre("");
        setApellido("");
        setTelefono("");
        setUsuarioId(""); 
        setEnfermero(""); 
        setCitaEstado("");
        setIsEdit(false); 
    };

    const mostrarFecha = () => {
        setShowDatePicker(true);
    };

    const manejarFecha = (event, selectedDate) => {
        const currentDate = selectedDate || fecha;
        setShowDatePicker(false);
        setFecha(currentDate);
    };

    const mostrarHora = () => {
        setShowTimePicker(true);
    };

    const manejarHora = (event, selectedTime) => {
        const currentTime = selectedTime || hora;
        setShowTimePicker(false);
        setHora(currentTime);
    };

    const openCitaListModal = () => {
        setModalVisible(true);
    };

    // Función para obtener la lista de clientes
    const fetchCita = async () => {
        try {
            const response = await fetch("http://arturo.bonaquian.com/ProyectoFinalBacken/cita.php", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();
            if (Array.isArray(result)) {
                setCita(result);
            } else {
                Alert.alert("Error", "No se pudieron obtener los clientes.");
            }
        } catch (error) {
            console.error("Error al obtener clientes:", error);
            Alert.alert("Error", "No se pudo conectar al servidor.");
        }
    };

    // Función para cargar los datos de la cita cuando se hace clic en "Editar"
    const cargarCitaParaEditar = async (citaId) => {
        try {
            const response = await fetch(`http://arturo.bonaquian.com/ProyectoFinalBacken/cita.php?cita_id=${citaId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            const cita = await response.json();
            if (cita.cita_id) {
                setIdentificacion(cita.cita_identificacion);
                setNombre(cita.cita_nombre);
                setApellido(cita.cita_apellido);
                setTelefono(cita.cita_telefono);
                setUsuarioId(cita.usuario_id);
                setEnfermero(cita.cita_enfermero);
                setFecha(new Date(cita.cita_fecha));
                setHora(new Date(`1970-01-01T${cita.cita_hora}`)); // Ajustar la hora
                setCitaEstado(cita.cita_estado);
                setIsEdit(true);  // Aquí activamos el modo de edición
                setCitaId(cita.cita_id);  // Guardar el ID de la cita a editar
                setFormVisible(true);
            } else {
                Alert.alert("Error", "Cita no encontrada.");
            }
        } catch (error) {
            console.error("Error al obtener los datos de la cita:", error);
            Alert.alert("Error", "No se pudo obtener los datos de la cita.");
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: isNightMode ? '#121212' : '#A3D5FF' }]}>
            <Text style={[styles.title, { color: isNightMode ? '#FFFFFF' : '#2A4C7B' }]}>Crear Cita</Text>
            <Button title="Listar Citas" onPress={openCitaListModal} />
            <Button title="Nuevo Cita" onPress={() => {
                limpiarCampos();
                setFormVisible(true);
            }} />
            <View style={styles.space} />

            {/* Modal para listar citas */}
            <Modal visible={modalVisible} animationType="slide" transparent={false} onRequestClose={() => setModalVisible(false)}>
                <View style={[styles.modalContainer, { backgroundColor: isNightMode ? '#444' : '#fff' }]}>
                <Button title="Cerrar" onPress={() => setModalVisible(false)} />
                    <Text style={[styles.modalTitle, { color: isNightMode ? '#fff' : '#000' }]}>Listado de Citas</Text>

                    <FlatList
                        style={styles.flatList}
                        data={cita}  // Aquí pasa directamente el array de citas
                        keyExtractor={(item) => item.cita_id.toString()}  // Asegúrate de usar un valor único para cada item
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
                                <Text style={[styles.tableCell, { color: isNightMode ? '#fff' : '#000' }]}>{item.cita_id}</Text>
                                <Text style={[styles.tableCell, { color: isNightMode ? '#fff' : '#000' }]}>{item.cita_nombre}</Text>
                                <Text style={[styles.tableCell, { color: isNightMode ? '#fff' : '#000' }]}>{item.cita_estado}</Text>
                                <View style={styles.tableCell}>
                                    <Button title="Editar" onPress={() => cargarCitaParaEditar(item.cita_id)} />
                                </View>
                            </View>
                        )}
                    />
                </View>
            </Modal>

            {/* Formulario de Cita */}
            {formVisible && (
                <>
                    <TextInput style={[styles.input, { backgroundColor: isNightMode ? '#555' : '#fff', color: isNightMode ? '#fff' : '#000' }]} placeholder="Identificación" value={identificacion} onChangeText={setIdentificacion} keyboardType="numeric" />
                    <TextInput style={[styles.input, { backgroundColor: isNightMode ? '#555' : '#fff', color: isNightMode ? '#fff' : '#000' }]} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
                    <TextInput style={[styles.input, { backgroundColor: isNightMode ? '#555' : '#fff', color: isNightMode ? '#fff' : '#000' }]} placeholder="Apellido" value={apellido} onChangeText={setApellido} />
                    <TextInput style={[styles.input, { backgroundColor: isNightMode ? '#555' : '#fff', color: isNightMode ? '#fff' : '#000' }]} placeholder="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
                    
                    <Picker
                        selectedValue={usuarioId}
                        onValueChange={(itemValue) => setUsuarioId(itemValue)}
                        style={[styles.input, { color: isNightMode ? '#fff' : '#000' }]}
                    >
                        <Picker.Item label="Selecciona Doctor" value="" />
                        {usuarios.map((usuario) => (
                            <Picker.Item key={usuario.usuario_id} label={usuario.usuario_nombre} value={usuario.usuario_id} />
                        ))}
                    </Picker>

                    <Picker
                        selectedValue={enfermero}
                        onValueChange={(itemValue) => setEnfermero(itemValue)}
                        style={[styles.input, { color: isNightMode ? '#fff' : '#000' }]}
                    >
                        <Picker.Item label="Selecciona Enfermero" value="" />
                        {enfermeros.map((enfermeroItem) => (
                            <Picker.Item key={enfermeroItem.usuario_id} label={enfermeroItem.usuario_nombre} value={enfermeroItem.usuario_id} />
                        ))}
                    </Picker>

                    <Button title="Seleccionar Fecha" onPress={mostrarFecha} />
                    {showDatePicker && (
                        <DateTimePicker
                            value={fecha}
                            mode="date"
                            display="default"
                            onChange={manejarFecha}
                        />
                    )}
                    <Text style={{ color: isNightMode ? '#fff' : '#000' }}>Fecha seleccionada: {fecha.toLocaleDateString()}</Text>

                    <Button title="Seleccionar Hora" onPress={mostrarHora} />
                    {showTimePicker && (
                                               <DateTimePicker
                                               value={hora}
                                               mode="time"
                                               display="default"
                                               onChange={manejarHora}
                                           />
                                       )}
                                       <Text style={{ color: isNightMode ? '#fff' : '#000' }}>Hora seleccionada: {hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                   
                                       <Picker
                                           selectedValue={citaEstado}
                                           onValueChange={(itemValue) => setCitaEstado(itemValue)}
                                           style={[styles.input, { color: isNightMode ? '#fff' : '#000' }]}
                                       >
                                           <Picker.Item label="Estado de la Cita" value="" />
                                           <Picker.Item label="Pendiente" value="Pendiente" />
                                           <Picker.Item label="Confirmada" value="Confirmada" />
                                           <Picker.Item label="Cancelada" value="Cancelada" />
                                       </Picker>
                   
                                       <Button title={isEdit ? "Actualizar Cita" : "Guardar Cita"} onPress={enviarDatos} />
                                   </>
                               )}
                           </ScrollView>
                       );
                   }
                   
                   const styles = StyleSheet.create({
                       container: {
                           flex: 1,
                           padding: 20,
                       },
                       title: {
                           fontSize: 24,
                           fontWeight: 'bold',
                           marginBottom: 20,
                           textAlign: 'center',
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
                   });
                   
                 