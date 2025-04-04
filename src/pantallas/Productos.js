import React, { useState, useEffect } from "react";
import { Image, View, TextInput, Button, FlatList, Text, StyleSheet, Modal, ScrollView, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../componentes/ThemeContext'; // Importa el hook del contexto

export default function ProductoApp() {
    // Variables de estado
    const { isNightMode } = useTheme(); // Usa el contexto para obtener el estado del modo nocturno
    const [modalVisible, setModalVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [codigo, setCodigo] = useState("");
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [stock, setStock] = useState("");
    const [precio, setPrecio] = useState("");
    const [fechaE, setFechaE] = useState(new Date());
    const [tipo, setTipo] = useState("");
    const [foto, setFoto] = useState(null);
    const [productos, setProductos] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        fetchProductos();
    }, []);

    // Obtener productos desde el backend
    const fetchProductos = async () => {
        try {
            const response = await fetch("http://arturo.bonaquian.com/ProyectoFinalBacken/producto.php", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();
            if (Array.isArray(result)) {
                setProductos(result);
            } else {
                Alert.alert("Error", "No se pudieron obtener los productos.");
            }
        } catch (error) {
            console.error("Error al obtener productos:", error);
            Alert.alert("Error", "No se pudo conectar al servidor.");
        }
    };

    const cargarProductoParaEditar = async (productoCodigo) => {
        try {
            const response = await fetch(`http://arturo.bonaquian.com/ProyectoFinalBacken/producto.php?producto_codigo=${productoCodigo}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const producto = await response.json();
            if (producto.producto_codigo) {
                setCodigo(producto.producto_codigo);
                setNombre(producto.producto_nombre);
                setDescripcion(producto.producto_descrip);
                setStock(producto.producto_stock.toString());
                setPrecio(producto.producto_precio.toString());
                setFechaE(new Date(producto.producto_fechaE));
                setTipo(producto.producto_tipo);
                const urlimg = "http://arturo.bonaquian.com/ProyectoFinalBacken/";
                setFoto(producto.producto_foto ? urlimg + producto.producto_foto : null);
                setIsEdit(true);
                setFormVisible(true);
            } else {
                Alert.alert("Error", "Producto no encontrado.");
            }
        } catch (error) {
            console.error("Error al obtener los datos del producto:", error);
            Alert.alert("Error", "No se pudo obtener los datos del producto.");
        }
    };

    // Tomar foto con la cámara
    const tomarFoto = async () => {
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
        if (!codigo || !nombre || !descripcion || !stock || !precio || !tipo || !foto) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }

        try {
            let formData = new FormData();
            formData.append("producto_codigo", codigo);
            formData.append("producto_nombre", nombre);
            formData.append("producto_descrip", descripcion);
            formData.append("producto_stock", stock);
            formData.append("producto_precio", precio);
            formData.append("producto_fechaE", fechaE.toISOString().split('T')[0]); // Formato YYYY-MM-DD
            formData.append("producto_tipo", tipo);

            // Agregar la imagen al FormData
            const fileName = foto.split('/').pop();
            const fileType = fileName.split('.').pop();
            
            formData.append("producto_foto", {
                uri: foto,
                name: fileName,
                type: `image/${fileType}`,
            });

            const endpoint = isEdit 
                ? "http://arturo.bonaquian.com/ProyectoFinalBacken/producto_update.php" 
                : "http://arturo.bonaquian.com/ProyectoFinalBacken/producto_save.php";

            const response = await fetch(endpoint, {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (result.status === "success") {
                Alert.alert("Éxito", result.message);
                limpiarCampos();
                fetchProductos(); // Refrescar la lista de productos
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
        setCodigo("");
        setNombre("");
        setDescripcion("");
        setStock("");
        setPrecio("");
        setFechaE(new Date());
        setTipo("");
        setFoto(null);
        setIsEdit(false);
    };

    // Mostrar el selector de fecha
    const mostrarSelectorFecha = () => {
        setShowDatePicker(true);
    };

    // Manejar la selección de fecha
    const manejarFecha = (event, selectedDate) => {
        const currentDate = selectedDate || fechaE;
        setShowDatePicker(false);
        setFechaE(currentDate);
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: isNightMode ? '#121212' : '#A3D5FF' }]}>
            <Text style={[styles.title, { color: isNightMode ? '#FFFFFF' : '#2A4C7B' }]}>Mantenimiento de Productos</Text>

            <Button title="Listar Productos" onPress={() => {
                fetchProductos();
                setModalVisible(true);
            }} />
            <Button title="Nuevo Producto" onPress={() => {
                limpiarCampos();
                setFormVisible(true);
            }} />
            <View style={styles.space} />

            {/* Modal para listar productos */}
            <Modal visible={modalVisible} animationType="slide" transparent={false} onRequestClose={() => setModalVisible(false)}>
                <View style={[styles.modalContainer, { backgroundColor: isNightMode ? '#444' : '#fff' }]}>
                    <Button title="Cerrar" onPress={() => setModalVisible(false)} />
                    <Text style={[styles.modalTitle, { color: isNightMode ? '#fff' : '#000' }]}>Listado de Productos</Text>

                    <FlatList
                        style={styles.flatList}
                        data={productos}
                        keyExtractor={(item) => item.producto_codigo.toString()}
                        ListHeaderComponent={() => (
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableHeaderText, { color: isNightMode ? '#fff' : '#000' }]}>Código</Text>
                                <Text style={[styles.tableHeaderText, { color: isNightMode ? '#fff' : '#000' }]}>Nombre</Text>
                                <Text style={[styles.tableHeaderText, { color: isNightMode ? '#fff' : '#000' }]}>Stock</Text>
                                <Text style={[styles.tableHeaderText, { color: isNightMode ? '#fff' : '#000' }]}>Acciones</Text>
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell, { color: isNightMode ? '#fff' : '#000' }]}>{item.producto_codigo}</Text>
                                <Text style={[styles.tableCell, { color: isNightMode ? '#fff' : '#000' }]}>{item.producto_nombre}</Text>
                                <Text style={[styles.tableCell, { color: isNightMode ? '#fff' : '#000' }]}>{item.producto_stock}</Text>
                                <View style={styles.tableCell}>
                                    <Button title="Editar" onPress={() => cargarProductoParaEditar(item.producto_codigo)} />
                                </View>
                            </View>
                        )}
                    />
                </View>
            </Modal>

            {/* Formulario de Registro o Edición */}
            {formVisible && (
                <View>
                    <TextInput style={[styles.input, { backgroundColor: isNightMode ? '#555' : '#fff', color: isNightMode ? '#fff' : '#000' }]} placeholder="Código" value={codigo} onChangeText={setCodigo} keyboardType="numeric" />
                    <TextInput style={[styles.input, { backgroundColor: isNightMode ? '#555' : '#fff', color: isNightMode ? '#fff' : '#000' }]} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
                    <TextInput style={[styles.input, { backgroundColor: isNightMode ? '#555' : '#fff', color: isNightMode ? '#fff' : '#000' }]} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
                    <TextInput style={[styles.input, { backgroundColor: isNightMode ? '#555' : '#fff', color: isNightMode ? '#fff' : '#000' }]} placeholder="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" />
                    <TextInput style={[styles.input, { backgroundColor: isNightMode ? '#555' : '#fff', color: isNightMode ? '#fff' : '#000' }]} placeholder="Precio" value={precio} onChangeText={setPrecio} keyboardType="numeric" />

                    <Button title="Seleccionar Fecha de Expiración" onPress={mostrarSelectorFecha} />
                    {showDatePicker && (
                        <DateTimePicker
                            value={fechaE}
                            mode="date"
                            display="default"
                            onChange={manejarFecha}
                        />
                    )}
                    <Text style={{ color: isNightMode ? '#fff' : '#000' }}>Fecha de Expiración: {fechaE.toLocaleDateString()}</Text>

                    <Picker
                        selectedValue={tipo}
                        onValueChange={(itemValue) => setTipo(itemValue)}
                        style={[styles.seleccion, { color: isNightMode ? '#fff' : '#000' }]}
                    >
                        <Picker.Item label="Selecciona un tipo" value="" />
                        <Picker.Item label="Pasta Dental" value="Pasta Dental" />
                        <Picker.Item label="Cepillo" value="Cepillo" />
                        <Picker.Item label="Enjuague" value="Enjuague" />
                    </Picker>

                    <Button title="Tomar Foto" onPress={tomarFoto} />
                    {foto && <Image source={{ uri: foto }} style={styles.foto} />}
                    <Button title={isEdit ? "Actualizar Producto" : "Guardar Producto"} onPress={enviarDatos} />
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    space: {
        height: 20,
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
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    flatList: {
        flex: 1,
    },
    input: {
        borderWidth: 2,
        borderColor: "#ccc",
        padding: 10,
        marginTop: 10,
        marginBottom: 5,
        borderRadius: 5,
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
        marginBottom: 10,
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