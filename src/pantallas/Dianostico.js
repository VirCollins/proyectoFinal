import React, { useState, useEffect } from "react";
import { View, TextInput, Text, Button, Alert, StyleSheet, ScrollView, Modal, FlatList } from "react-native";
import { Picker } from '@react-native-picker/picker';  
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../componentes/ThemeContext'; // Importa el hook del contexto
import Bitacora from '../componentes/Bitacora';

export default function DiagnosticoApp() {
    const { isNightMode } = useTheme(); // Usa el contexto para obtener el estado del modo nocturno
    // Estados para manejar los datos del formulario
    const [diagnosticoDescripcion, setDiagnosticoDescripcion] = useState("");
    const [diagnosticoFecha, setDiagnosticoFecha] = useState(new Date());
    const [diagnosticoHora, setDiagnosticoHora] = useState(new Date());
    const [diagnosticoEstado, setDiagnosticoEstado] = useState("");
    const [usuarioId, setUsuarioId] = useState("");
    const [usuarioEnfermero, setUsuarioEnfermero] = useState("");
    const [citaPaciente, setCitaPaciente] = useState(""); // Estado para el paciente
    const [usuarios, setUsuarios] = useState([]);
    const [pacientes, setPacientes] = useState([]); 
    const [enfermeros, setEnfermero] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentDiagnostico, setCurrentDiagnostico] = useState(null);
    const [diagnosticos, setDiagnosticos] = useState([]); // Estado para la lista de diagnósticos
    const [diagnosticoid, setDianosticoid] = useState([]);
    

    // Cargar usuarios y pacientes desde la API
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
                setEnfermero(data);
            } catch (error) {
                console.error("Error al cargar enfermeros:", error);
                Alert.alert("Error", "No se pudo cargar la lista de enfermeros");
            }
        };

        const cargarPacientes = async () => {
            try {
                const response = await fetch("http://arturo.bonaquian.com/ProyectoFinalBacken/obtener_paciente.php");
                const data = await response.json();
                setPacientes(data);
            } catch (error) {
                console.error("Error al cargar pacientes:", error);
                Alert.alert("Error", "No se pudo cargar la lista de pacientes");
            }
        };

        cargarUsuarios();
        cargarEnfermero();
        cargarPacientes();
        fetchDiagnosticos(); 
    }, []);

    const enviarDatos = async () => {
        if (!diagnosticoDescripcion || !usuarioId || !usuarioEnfermero || !citaPaciente || !diagnosticoEstado) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }
    
        try {
            let formData = new FormData();
            formData.append("diagnostico_id", diagnosticoid); // Asegúrate de que esto esté correcto
            formData.append("diagnostico_descripcion", diagnosticoDescripcion);
            formData.append("usuario_id", usuarioId);
            formData.append("usuario_enfermero", usuarioEnfermero);
            formData.append("cita_paciente", citaPaciente);
            formData.append("diagnostico_fecha", diagnosticoFecha.toISOString().split('T')[0]); // Formato YYYY-MM-DD
            formData.append("diagnostico_hora", diagnosticoHora.toTimeString().split(' ')[0].slice(0, 5)); // Formato HH:MM
            formData.append("diagnostico_estado", diagnosticoEstado);
    
            const endpoint = isEdit
                ? "http://arturo.bonaquian.com/ProyectoFinalBacken/diagnostico_update.php"
                : "http://arturo.bonaquian.com/ProyectoFinalBacken/diagnostico_save.php";
    
                const response = await fetch(endpoint, {
                    method: "POST",
                    body: formData,
                });
        
                const textResponse = await response.text();
                let result;
                try {
                    result = JSON.parse(textResponse);
                } catch (jsonError) {
                    console.error("Error al analizar JSON:", jsonError);
                    Alert.alert("Error", "La respuesta del servidor no es un JSON válido.");
                    return;
                }
        
                if (result.status === "success") {
                    Alert.alert("Éxito", result.message);
                    limpiarCampos();
                    fetchDiagnosticos();
                    Bitacora.saveBitacora("diagnostico recibido",citaPaciente);
                    
                } else {
                    Alert.alert("Error", result.message);
                }
            } catch (error) {
                console.error("Error al enviar los datos:", error);
                Alert.alert("Error", "No se pudo conectar con el servidor");
            }
        };
    
        // Limpiar campos del formulario
        const limpiarCampos = () => {
            setDiagnosticoDescripcion("");
            setUsuarioId("");
            setUsuarioEnfermero("");
            setCitaPaciente(""); // Limpiar el paciente
            setDiagnosticoEstado("");
            setIsEdit(false); // Resetear el estado de edición
        };
    
        // Mostrar el selector de fecha
        const mostrarFecha = () => {
            setShowDatePicker(true);
        };
    
        // Manejar la selección de la fecha
        const manejarFecha = (event, selectedDate) => {
            const currentDate = selectedDate || diagnosticoFecha;
            setShowDatePicker(false);
            setDiagnosticoFecha(currentDate);
        };
    
        // Mostrar el selector de hora
        const mostrarHora = () => {
            setShowTimePicker(true);
        };
    
        // Manejar la selección de la hora
        const manejarHora = (event, selectedTime) => {
            const currentTime = selectedTime || diagnosticoHora;
            setShowTimePicker(false);
            setDiagnosticoHora(currentTime);
        };
    
        // Función para abrir el modal de lista de diagnósticos
        const openDiagnosticoListModal = () => {
            setModalVisible(true);
        };
    
        // Función para obtener la lista de diagnósticos
        const fetchDiagnosticos = async () => {
            try {
                const response = await fetch("http://arturo.bonaquian.com/ProyectoFinalBacken/dianostico.php", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
    
                const result = await response.json();
                if (Array.isArray(result)) {
                    setDiagnosticos(result);
                } else {
                    Alert.alert("Error", "No se pudieron obtener los diagnósticos.");
                }
            } catch (error) {
                console.error("Error al obtener diagnósticos:", error);
                Alert.alert("Error", "No se pudo conectar al servidor.");
            }
        };
    
        // Función para cargar los datos del diagnóstico cuando se hace clic en "Editar"
        const cargarDiagnosticoParaEditar = async (diagnosticoId) => {
            try {
                const response = await fetch(`http://arturo.bonaquian.com/ProyectoFinalBacken/dianostico.php?dianostico_id=${diagnosticoId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
    
                const diagnostico = await response.json();
                if (diagnostico.dianostico_id) {
                    setDianosticoid(diagnostico.dianostico_id);
                    setDiagnosticoDescripcion(diagnostico.dianostico_descrip);
                    setUsuarioId(diagnostico.usuario_id);
                    setUsuarioEnfermero(diagnostico.usuario_enfermero);
                    setCitaPaciente(diagnostico.cita_paciente);
                    setDiagnosticoFecha(new Date(diagnostico.dianostico_fecha));
                    setDiagnosticoHora(new Date(`1970-01-01T${diagnostico.dianostico_hora}`)); // Ajustar la hora
                    setDiagnosticoEstado(diagnostico.dianostico_estado);
                    setIsEdit(true);  // Activar el modo de edición
                    setFormVisible(true);
                } else {
                    Alert.alert("Error", "Diagnóstico no encontrado.");
                }
            } catch (error) {
                console.error("Error al obtener los datos del diagnóstico:", error);
                Alert.alert("Error", "No se pudo obtener los datos del diagnóstico.");
            }
        };
    
        return (
            <ScrollView style={[styles.container, { backgroundColor: isNightMode ? '#121212' : '#A3D5FF' }]}>
                <Text style={[styles.title, { color: isNightMode ? '#FFFFFF' : '#2A4C7B' }]}>Crear Diagnóstico</Text>
                <Button title="Listar Diagnósticos" onPress={openDiagnosticoListModal} />
                <Button title="Nuevo Diagnóstico" onPress={() => {
                    limpiarCampos();
                    setFormVisible(true);
                }} />
                <View style={styles.space} />
    
                {/* Modal para listar diagnósticos */}
                <Modal visible={modalVisible} animationType="slide" transparent={false} onRequestClose={() => setModalVisible(false)}>
                    <View style={[styles.modalContainer, { backgroundColor: isNightMode ? '#444' : '#fff' }]}>
                        <Button title="Cerrar" onPress={() => setModalVisible(false)} />
                        <Text style={[styles.modalTitle, { color: isNightMode ? '#fff' : '#000' }]}>Listado de Diagnósticos</Text>
    
                        <FlatList
                            style={styles.flatList}
                            data={diagnosticos} // Aquí se cargan los diagnósticos desde el estado
                            keyExtractor={(item) => item.dianostico_id.toString()}
                            ListHeaderComponent={() => (
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.tableHeaderText, { color: isNightMode ? '#fff' : '#000' }]}>ID</Text>
                                    <Text style={[styles.tableHeaderText, { color: isNightMode ? '#fff' : '#000' }]}>Descripción</Text>
                                    <Text style={[styles.tableHeaderText, { color: isNightMode ? '#fff' : '#000' }]}>Estado</Text>
                                    <Text style={[styles.tableHeaderText, { color: isNightMode ? '#fff' : '#000' }]}>Acciones</Text>
                                </View>
                            )}
                            renderItem={({ item }) => (
                                <View style={styles.tableRow}>
                                    <Text style={[styles.tableCell, { color: isNightMode ? '#fff' : '#000' }]}>{item.dianostico_id}</Text>
                                    <Text style={[styles.tableCell, { color: isNightMode ? '#fff' : '#000' }]}>{item.dianostico_descrip}</Text>
                                    <Text style={[styles.tableCell, { color: isNightMode ? '#fff' : '#000' }]}>{item.dianostico_estado}</Text>
                                    <View style={styles.tableCell}>
                                        <Button title="Editar" onPress={() => cargarDiagnosticoParaEditar(item.dianostico_id)} />
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                </Modal>
    
                {/* Formulario de Diagnóstico */}
                {formVisible && (
                    <>
                        <Picker
                            selectedValue={usuarioId}
                            onValueChange={(itemValue) => setUsuarioId(itemValue)}
                            style={[styles.input, { color: isNightMode ? '#fff' : '#000' }]}
                        >
                            <Picker.Item label="Selecciona Usuario" value="" />
                            {usuarios.map((usuario) => (
                                <Picker.Item key={usuario.usuario_id} label={usuario.usuario_nombre} value={usuario.usuario_id} />
                            ))}
                        </Picker>
    
                        <Picker
                            selectedValue={usuarioEnfermero}
                            onValueChange={(itemValue) => setUsuarioEnfermero(itemValue)}
                            style={[styles.input, { color: isNightMode ? '#fff' : '#000' }]}
                        >
                            <Picker.Item label="Selecciona Enfermero" value="" />
                            {enfermeros.map((enfermero) => (
                                <Picker.Item key={enfermero.usuario_id} label={enfermero.usuario_nombre} value={enfermero.usuario_id} />
                            ))}
                        </Picker>
    
                        <Picker
                            selectedValue={citaPaciente}
                            onValueChange={(itemValue) => setCitaPaciente(itemValue)}
                            style={[styles.input, { color: isNightMode                         ? '#fff' : '#000' }]}
                            >
                                <Picker.Item label="Selecciona Paciente" value="" />
                                {pacientes.map((paciente) => (
                                    <Picker.Item key={paciente.cita_id} label={paciente.cita_nombre} value={paciente.cita_id} />
                                ))}
                            </Picker>
        
                            <Button title="Seleccionar Fecha" onPress={mostrarFecha} />
                            {showDatePicker && (
                                <DateTimePicker
                                    value={diagnosticoFecha}
                                    mode="date"
                                    display="default"
                                    onChange={manejarFecha}
                                />
                            )}
                            <Text style={{ color: isNightMode ? '#fff' : '#000' }}>Fecha seleccionada: {diagnosticoFecha.toLocaleDateString()}</Text>
        
                            <Button title="Seleccionar Hora" onPress={mostrarHora} />
                            {showTimePicker && (
                                <DateTimePicker
                                    value={diagnosticoHora}
                                    mode="time"
                                    display="default"
                                    onChange={manejarHora}
                                />
                            )}
                            <Text style={{ color: isNightMode ? '#fff' : '#000' }}>Hora seleccionada: {diagnosticoHora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        
                            <TextInput
                                style={[styles.input, { backgroundColor: isNightMode ? '#555' : '#fff', color: isNightMode ? '#fff' : '#000' }]}
                                placeholder="Descripción del Diagnóstico"
                                value={diagnosticoDescripcion}
                                onChangeText={setDiagnosticoDescripcion}
                            />
        
                            <Picker
                                selectedValue={diagnosticoEstado}
                                onValueChange={(itemValue) => setDiagnosticoEstado(itemValue)}
                                style={[styles.input, { color: isNightMode ? '#fff' : '#000' }]}
                            >
                                <Picker.Item label="Estado del Diagnóstico" value="" />
                                <Picker.Item label="Pendiente" value="Pendiente" />
                                <Picker.Item label="Confirmado" value="Confirmado" />
                                <Picker.Item label="Cancelado" value="Cancelado" />
                            </Picker>
        
                            <Button title={isEdit ? "Actualizar Diagnóstico" : "Guardar Diagnóstico"} onPress={enviarDatos} />
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
                textAlign: "center",
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 20,
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