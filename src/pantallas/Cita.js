import React, { useState, useEffect } from "react";
import { Image, View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker'; 
import DateTimePicker from '@react-native-community/datetimepicker'; 

export default function App() {
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

        cargarUsuarios();
        
        const cargarEnfermero = async () => {
            try {
                const response = await fetch("http://phpbacken123.whf.bz/ProyectoFinalBacken/obtener_enfermeros.php");
                const data = await response.json();
                setEnfermeros(data);
            } catch (error) {
                console.error("Error al cargar enfermeros:", error);
                Alert.alert("Error", "No se pudo cargar la lista de enfermeros");
            }
        };
        
        cargarEnfermero();
    }, []);

    const enviarDatos = async () => {
        if (!identificacion || !nombre || !apellido || !telefono || !usuarioId || !enfermero || !citaEstado) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }

        try {
            let formData = new FormData();
            formData.append("cita_identificacion", identificacion);
            formData.append("cita_nombre", nombre);
            formData.append("cita_apellido", apellido);
            formData.append("cita_telefono", telefono);
            formData.append("usuario_id", usuarioId);
            formData.append("cita_enfermero", enfermero);
            formData.append("cita_fecha", fecha.toISOString().split('T')[0]); 
            formData.append("cita_hora", hora.toISOString().split('T')[1].slice(0, 5)); 
            formData.append("cita_estado", citaEstado);

            const response = await fetch("http://arturo.bonaquian.com/ProyectoFinalBacken/cita_save.php", {
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                body: formData,
            });

            const result = await response.json();
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

    const limpiarCampos = () => {
        setIdentificacion("");
        setNombre("");
        setApellido("");
        setTelefono("");
        setUsuarioId(""); 
        setEnfermero(""); 
        setCitaEstado(""); 
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

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Crear de Cita</Text>
            <TextInput style={styles.input} placeholder="Identificación" value={identificacion} onChangeText={setIdentificacion} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.input} placeholder="Apellido" value={apellido} onChangeText={setApellido} />
            <TextInput style={styles.input} placeholder="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
            
            <Picker
                selectedValue={usuarioId}
                onValueChange={(itemValue) => setUsuarioId(itemValue)}
                style={styles.input}
            >
                <Picker.Item label="Selecciona Doctor" value="" />
                {usuarios.map((usuario) => (
                    <Picker.Item key={usuario.usuario_id} label={usuario.usuario_nombre} value={usuario.usuario_id} />
                ))}
            </Picker>

            <Picker
                selectedValue={enfermero}
                onValueChange={(itemValue) => setEnfermero(itemValue)}
                style={styles.input}
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

            <Button title="Seleccionar Hora" onPress={mostrarHora} />
            {showTimePicker && (
                <DateTimePicker
                    value={hora}
                    mode="time"
                    display="default"
                    onChange={manejarHora}
                />
            )}

            <Picker
                selectedValue={citaEstado}
                onValueChange={(itemValue) => setCitaEstado(itemValue)}
                style={styles.input}
            >
                <Picker.Item label="Estado de la Cita" value="" />
                <Picker.Item label="Pendiente" value="Pendiente" />
                <Picker.Item label="Confirmada" value="Confirmada" />
                <Picker.Item label="Cancelada" value="Cancelada" />
            </Picker>

            <Button title="Guardar Cita" onPress={enviarDatos} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#A3D5FF",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#2A4C7B',
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: "#fff",
    },
});
