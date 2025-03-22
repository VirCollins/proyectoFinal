import React, { useState, useEffect } from "react";
import { View, TextInput, Text, Button, Alert, StyleSheet, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';  
import DateTimePicker from '@react-native-community/datetimepicker';

export default function App() {
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
    const [Enfermero, setEnfermero] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Cargar usuarios y pacientes desde la API
    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                const response = await fetch("http://phpbacken123.whf.bz/ProyectoFinalBacken/obtener_Doctor.php");
                const data = await response.json();
                setUsuarios(data);
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
                Alert.alert("Error", "No se pudo cargar la lista de usuarios");
            }
        };

        const cargarEmfermero = async () => {
            try {
                const response = await fetch("http://phpbacken123.whf.bz/ProyectoFinalBacken/obtener_enfermeros.php");
                const data = await response.json();
                setEnfermero(data);
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
                Alert.alert("Error", "No se pudo cargar la lista de usuarios");
            }
        };

        const cargarPacientes = async () => {
            try {
                const response = await fetch("http://phpbacken123.whf.bz/ProyectoFinalBacken/obtener_paciente.php"); // Cambia esta URL según tu API
                const data = await response.json();
                setPacientes(data);
            } catch (error) {
                console.error("Error al cargar pacientes:", error);
                Alert.alert("Error", "No se pudo cargar la lista de pacientes");
            }
        };

        cargarUsuarios();
        cargarEmfermero();
        cargarPacientes();
    }, []);

    // Función para enviar los datos al servidor
    const enviarDatos = async () => {
        if (!diagnosticoDescripcion || !usuarioId || !usuarioEnfermero || !citaPaciente || !diagnosticoEstado) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }

        try {
            let formData = new FormData();
            formData.append("diagnostico_descripcion", diagnosticoDescripcion);
            formData.append("usuario_id", usuarioId);
            formData.append("usuario_enfermero", usuarioEnfermero);
            formData.append("cita_paciente", citaPaciente); // Añadir el paciente
            formData.append("diagnostico_fecha", diagnosticoFecha.toISOString().split('T')[0]);
            formData.append("diagnostico_hora", diagnosticoHora.toISOString().split('T')[1].slice(0, 5));
            formData.append("diagnostico_estado", diagnosticoEstado);

            const response = await fetch("http://arturo.bonaquian.com/ProyectoFinalBacken/diagnostico_save.php", {
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

    // Limpiar campos del formulario
    const limpiarCampos = () => {
        setDiagnosticoDescripcion("");
        setUsuarioId("");
        setUsuarioEnfermero("");
        setCitaPaciente(""); // Limpiar el paciente
        setDiagnosticoEstado("");
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

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Crear de Dianostico</Text>
            {/* Selección de Usuario */}
            <Picker
                selectedValue={usuarioId}
                onValueChange={(itemValue) => setUsuarioId(itemValue)}
                style={styles.input}
            >
                <Picker.Item label="Selecciona Usuario" value="" />
                {usuarios.map((usuario) => (
                    <Picker.Item key={usuario.usuario_id} label={usuario.usuario_nombre} value={usuario.usuario_id} />
                ))}
            </Picker>

            {/* Selección de Enfermero */}
            <Picker
                selectedValue={usuarioEnfermero}
                onValueChange={(itemValue) => setUsuarioEnfermero(itemValue)}
                style={styles.input}
            >
                <Picker.Item label="Selecciona Enfermero" value="" />
                {Enfermero.map((enfermero) => (
                    <Picker.Item key={enfermero.usuario_id} label={enfermero.usuario_nombre} value={enfermero.usuario_id} />
                ))}
            </Picker>

            {/* Selección de Paciente */}
            <Picker
                selectedValue={citaPaciente}
                onValueChange={(itemValue) => setCitaPaciente(itemValue)}
                style={styles.input}
            >
                <Picker.Item label="Selecciona Paciente" value="" />
                {pacientes.map((paciente) => (
                    <Picker.Item key={paciente.cita_id} label={paciente.cita_nombre} value={paciente.cita_id} />
                ))}
            </Picker>

            {/* Selector de Fecha */}
            <Button title="Seleccionar Fecha" onPress={mostrarFecha} />
            {showDatePicker && (
                <DateTimePicker
                    value={diagnosticoFecha}
                    mode="date"
                    display="default"
                    onChange={manejarFecha}
                />
            )}

            {/* Selector de Hora */}
            <Button title="Seleccionar Hora" onPress={mostrarHora} />
            {showTimePicker && (
                <DateTimePicker
                    value={diagnosticoHora}
                    mode="time"
                    display="default"
                    onChange={manejarHora}
                />
            )}

            {/* Descripción del Diagnóstico */}
            <TextInput
                style={styles.input}
                placeholder="Descripción del Diagnóstico"
                value={diagnosticoDescripcion}
                onChangeText={setDiagnosticoDescripcion}
            />

            {/* Estado del Diagnóstico */}
            <Picker
                selectedValue={diagnosticoEstado}
                onValueChange={(itemValue) => setDiagnosticoEstado(itemValue)}
                style={styles.input}
            >
                <Picker.Item label="Estado del Diagnóstico" value="" />
                <Picker.Item label="Pendiente" value="Pendiente" />
                <Picker.Item label="Confirmado" value="Confirmado" />
                <Picker.Item label="Cancelado" value="Cancelado" />
            </Picker>

            {/* Botón para guardar */}
            <Button title="Guardar" onPress={enviarDatos} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#A3D5FF",
    },title:{
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: '#2A4C7B',
    },
    input: {
        borderWidth: 2,
        borderColor: "#ccc",
        padding: 10,
        marginTop:10,
        marginBottom:5,
        borderRadius: 5,
        backgroundColor: "#fff",
    }, 
});