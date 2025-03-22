import React, { useState, useEffect } from "react";
import { Image, View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { Picker } from '@react-native-picker/picker'; // Importación correcta

const Productos = () => {
    const [productoCodigo, setProductoCodigo] = useState('');
    const [productoNombre, setProductoNombre] = useState('');
    const [productoDescripcion, setProductoDescripcion] = useState('');
    const [productoStock, setProductoStock] = useState('');
    const [productoPrecio, setProductoPrecio] = useState('');
    const [productoFoto, setProductoFoto] = useState(null);
    const [productoTipo, setProductoTipo] = useState('');
    const [productoEstado, setProductoEstado] = useState('ACTIVO');
    const [fecha, setFecha] = useState(new Date());

     const requestCameraPermission = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            return status === "granted";
        };
    // Función para tomar foto
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
                setProductoFoto(result.assets[0].uri);
                Alert.alert("Éxito", "Foto tomada correctamente");
            } else {
                Alert.alert("Info", "El usuario canceló la toma de foto");
            }
        };

    // Enviar los datos al servidor (guardar producto)
    const enviarDatos = async () => {
        if (!productoCodigo || !productoNombre || !productoDescripcion || !productoStock || !productoPrecio || !productoFoto || !productoTipo) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }
    
            try {
                let formData = new FormData();
             formData.append("producto_codigo", productoCodigo);
             formData.append("producto_nombre", productoNombre);
            formData.append("producto_descripcion", productoDescripcion);
            formData.append("producto_stock", productoStock);
            formData.append("producto_precio", productoPrecio);
            formData.append("producto_tipo", productoTipo);
            formData.append("producto_estado", productoEstado);
            formData.append("producto_fechaE", fecha.toISOString().split('T')[0]);  
    
                // Agregar la imagen al FormData
                const fileName = productoFoto.split('/').pop();
                const fileType = fileName.split('.').pop();
                
                formData.append("producto_foto", {
                    uri: productoFoto,
                    name: fileName,
                    type: `image/${fileType}`,
                });
    
                const response = await fetch("http://192.168.100.122/ProyectoFinalBacken/producto_save.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    body: formData,
                });
                
                // Verifica la respuesta antes de intentar parsearla
                const responseText = await response.text();
                console.log("Respuesta del servidor (texto):", responseText);
                
                // Ahora intenta parsear como JSON si la respuesta no está vacía
                let result;
                try {
                    result = JSON.parse(responseText);
                } catch (e) {
                    console.error("Error al parsear JSON:", e);
                    Alert.alert("Error", "El servidor devolvió una respuesta no válida.");
                    return;
                }
                
                console.log("Respuesta del servidor:", result);
                
            } catch (error) {
                console.error("Error al enviar los datos:", error);
                Alert.alert("Error", "No se pudo conectar con el servidor");
            }
        };

    // Limpiar campos del formulario
    const limpiarCampos = () => {
        setProductoCodigo('');
        setProductoNombre('');
        setProductoDescripcion('');
        setProductoStock('');
        setProductoPrecio('');
        setProductoFoto(null);
        setProductoTipo('');
        setProductoEstado('');
        setFecha('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mantenimiento de Productos</Text>

            <TextInput 
                style={styles.input} 
                placeholder="Código del Producto" 
                value={productoCodigo} 
                onChangeText={setProductoCodigo} 
                keyboardType="numeric" 
            />
            <TextInput 
                style={styles.input} 
                placeholder="Nombre del Producto" 
                value={productoNombre} 
                onChangeText={setProductoNombre} 
            />
            <TextInput 
                style={styles.input} 
                placeholder="Descripción" 
                value={productoDescripcion} 
                onChangeText={setProductoDescripcion} 
            />
            <TextInput 
                style={styles.input} 
                placeholder="Stock" 
                value={productoStock} 
                onChangeText={setProductoStock} 
                keyboardType="numeric" 
            />
            <TextInput 
                style={styles.input} 
                placeholder="Precio" 
                value={productoPrecio} 
                onChangeText={setProductoPrecio} 
                keyboardType="numeric" 
            />

            <Picker
                selectedValue={productoTipo}
                onValueChange={(itemValue) => setProductoTipo(itemValue)}
                style={styles.input}
            >
                <Picker.Item label="Selecciona el tipo" value="" />
                <Picker.Item label="Pasta Dental" value="Pasta Dental" />
                <Picker.Item label="Cepillo" value="Cepillo" />
                <Picker.Item label="Enjuague Bocales" value="Enjuague Bocales" />
            </Picker>

            {/* Botón para tomar foto */}
            <Button title="Tomar Foto" onPress={tomarFoto} />
            {/* Mostrar la foto tomada */}
            {productoFoto && <Image source={{ uri: productoFoto }} style={{ width: 100, height: 100, marginTop: 20 }} />}

            <Button title="Guardar Producto" onPress={enviarDatos} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#A3D5FF",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
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

export default Productos;





