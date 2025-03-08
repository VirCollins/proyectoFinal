import React, { Component } from 'react'
import { Pressable,Text, View, StyleSheet } from 'react-native'

export class Boton extends Component {
  render() {
    const { text } = this.props;
    const {ColorFondo} = this.props;
    const {ColorFrente} = this.props;
    const {onPress} = this.props;
    return (
        <Pressable style = {[styles.container,
            ColorFondo?{backgroundColor:ColorFondo}:{}
            ]} onPress={onPress}>
                  <Text style={[styles.text,
                      ColorFrente?{color:ColorFrente}:{}
                  ]}>{text}</Text>
            </Pressable>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      width: '90%',
      padding: 15,
      marginVertical: 5,
      alignItems: 'center',
      borderRadius: 5,
     // backgroundColor: '#0000ff',
      color: 'white',
    },
    text: {
      fontSize: 20,
      color: 'white',
      fontWeight: 'bold',
    },
  
});

export default Boton
