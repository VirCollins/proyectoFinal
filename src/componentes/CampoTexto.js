import React, { Component } from 'react'
import { Text, View ,StyleSheet,TextInput} from 'react-native'

export class CampoTexto extends Component {
  render() {
    const { placeholder } = this.props;
    const {maxLength} = this.props;
    const {secureTextEntry} = this.props;
    const {value} = this.props;
    const {setValor} = this.props;
    return (
      <View style= {styles.container}>
       <TextInput placeholder={placeholder}
       maxLength={maxLength}
       secureTextEntry={secureTextEntry}
       value={value}
       onChangeText={setValor}></TextInput>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF', 
    width: '90%',
    borderColor: '#0A3D91',  
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    height: 45,  
    shadowColor: '#000',  
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  }
});


export default CampoTexto
