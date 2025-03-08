import React, { Component } from 'react'
import { Pressable, Text, View, StyleSheet } from 'react-native'

export class Boton extends Component {
  render() {
    const { text } = this.props;
    return (
      <Pressable style = {styles.container}>
            <Text style={styles.text}>{text}</Text>
      </Pressable>
    )
  }
}


const styles = StyleSheet.create({
    container: {
      width: '100%',
      padding: 15,
      marginVertical: 5,
      alignItems: 'center',
      borderRadius: 5,
      backgroundColor: '#0000ff',
      color: 'white',
    },
    text: {
      fontSize: 20,
      color: 'white',
      fontWeight: 'bold',
    },
  
});
export default Boton
