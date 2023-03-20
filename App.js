import React, {Component, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';
import Tarefa from './src/models/Tarefa';
import TarefaComp from "./src/Componentes/TarefaComp";
import Database from './src/Database/Database';
import {notificationManager} from './src/Services/NotificationManager';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

  const Stack = createNativeStackNavigator();

export default class App extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      nome: '',
      prioridade: '',
      data: '',
      lista: [],
    };
    this.Listar();
    this.localNotify = notificationManager;
    this.localNotify.configure();
    this.localNotify.createChannel();
    this.localNotify.scheduledNotifications("Atualize sua lista de leitura agora mesmo!", "Leu algum livro novo essa semana?")
  }

  componentDidMount() {
  }

  onPressSendNotification = (titulo) => {
    this.localNotify.showNotification(
      1,
      titulo,
      "Você adicionou esse livro na sua coleção!",
      {}, // data
      {} // options
    )
  }

  Listar = () => {
    const db = new Database();
    db.Listar().then(
      list => {
        this.setState({lista: list});
      }
    )
  }

  Cadastrar = (nome, prioridade, data) => {
    const tarNova = new Tarefa(nome, prioridade, data);
    const db = new Database();
    db.Inserir(tarNova);
    this.Listar();
    this.onPressSendNotification(nome);
  }

  Excluir = (id) => {
    const db = new Database();
    db.Remover(id);
    this.Listar();
  }

  AddScreen = ({navigation}) => {
    return(
      <View style={style.visao}>
    <View>
          <Text style={style.txt}>Nome do Livro:</Text>
          <TextInput onChangeText={(val) => {this.setState({nome: val})}} style={style.entrada}></TextInput>
          <Text style={style.txt}>Autor:</Text>
          <TextInput onChangeText={(val) => {this.setState({data: val})}} style={style.entrada}></TextInput>
          <Text style={style.txt}>Descrição:</Text>
          <TextInput onChangeText={(val) => {this.setState({prioridade: val})}} style={style.entrada}></TextInput>
        </View>
        <View>
            <TouchableOpacity
              onPress={() => this.Cadastrar(this.state.nome, this.state.prioridade, this.state.data)}
              style={style.botao}>
              < Text style={style.txt}>Adicionar</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
  }

  ListScreen = ({navigation}) =>{
    return(
      <SafeAreaView>
        <ScrollView>
      <View  style={style.vv}>
        <Text style={style.txt}>Livros da sua coleção:</Text>
        {
          this.state.lista.map(el =>(
            <TarefaComp 
            Id={el.Id}
            nome={el.nome}
            prioridade={el.prioridade}
            data={el.data}
            excluir={this.Excluir}
            nav={navigation}/>
          ))
        }
        </View>
        </ScrollView>
        </SafeAreaView>
    );
  }

  HomeScreen = ({navigation}) => {
    return(
      <View>
      <View style={style.visao}>
        <Text style={style.txt}>Seu aplicativo de biblioteca em casa.</Text>
        <Image style={style.stretch} source={require('./src/Images/book.png')}/>
        <View>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddScreen')}
              style={style.botao}>
              < Text style={style.txt}>Adicionar</Text>
            </TouchableOpacity>
        </View>
        
        <View><View style={style.bar}></View></View>
        <View>
            <TouchableOpacity
              onPress={() => navigation.navigate('ListScreen')}
              style={style.botao}>
              < Text style={style.txt}>Lista de livros</Text>
            </TouchableOpacity>
        </View>
     </View>
     </View>);
  }

 render(){
    return (
      <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeLiv" component={this.HomeScreen} />
        <Stack.Screen name="AddScreen" component={this.AddScreen} />
        <Stack.Screen name="ListScreen" component={this.ListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    );
  }
}


const style = StyleSheet.create({
  visao: {
    backgroundColor: '#141820', 
    alignItems: 'center',
    height: 2000,
  },
  vv: {
    backgroundColor: '#141820', 
    height: 2000,
  },
  stretch: {
    height: 200,
    width: 200,
  },
  botao: {
    backgroundColor:"#63b8ff",
    alignItems:'center',
    flexDirection: 'row',
    borderRadius:30,
  },
  entrada: {
    borderWidth: 1,
    borderColor:"#63b8ff",
    borderRadius:30,
    width:300,
    margin: 10,
    color: '#E5E5E0',
    fontSize: 18,
  },
  bar:{
    backgroundColor: '#737375',
    height: 20,
    width: 520,
    margin: 20,
  },
  txt: {
    fontSize: 18, color: '#E5E5E0', margin: 20,
  },
})