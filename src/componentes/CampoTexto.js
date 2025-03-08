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
      backgroundColor: '#ffffff',
      width: '90%',
      borderColor:'#e8e8e8',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginVertical: 10,
    }
});

export default CampoTexto
