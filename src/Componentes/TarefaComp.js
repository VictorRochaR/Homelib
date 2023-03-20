import React, {Component, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';

export default class TarefeComp extends Component{
  
 render(){
    return (
      <View>
        <View>
          <View style={style.entrada}><Text style={style.txtEntrada}>Nome: {this.props.nome}</Text></View>
          <View style={style.entrada}><Text style={style.txtEntrada}>Autor: {this.props.data}</Text></View>
          <View style={style.entrada}><Text style={style.txtEntrada}>Descrição: {this.props.prioridade}</Text></View>
        </View>
        <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {this.props.excluir(this.props.Id), this.props.nav.navigate('HomeLiv')}}
              style={style.botao}>
              < Text style={style.txt}>Excluir</Text>
            </TouchableOpacity>
        </View>
        <View style={style.bar}></View>
     </View>
      
      
    );
  }
}

const style = StyleSheet.create({
  visao: {
    backgroundColor: '#141820', 
    alignItems: 'center',
  },
  botao: {
    backgroundColor:"#63b8ff",
    alignItems:'center',
    flexDirection: 'row',
    borderRadius:30,
    fontSize:15,
    color: '#E5E5E0',
    left: 15,
  },
  entrada: {
    backgroundColor:"#63b8ff",
    borderRadius:30,
    margin: 10,
  },
  txtEntrada: {
    color: '#E5E5E0',
    fontSize: 18,
    margin: 10,
  },
  bar:{
    backgroundColor: '#737375',
    height: 5,
    margin: 10,
  },
  txt: {
    fontSize: 18, color: '#E5E5E0', margin: 20,
  },
})