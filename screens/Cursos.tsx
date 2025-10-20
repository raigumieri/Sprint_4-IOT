import React from "react";
import {Text, View, Image, TouchableOpacity, StyleSheet} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {Ionicons} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CursosStackParamList } from '../types/types';
import { useAuth } from "../context/AuthContext";

type CursosScreenNavigationProp = NativeStackNavigationProp<CursosStackParamList, 'Cursos'>;


const Cursos = () => {

    const navigation = useNavigation<CursosScreenNavigationProp>();

    const {usuario} = useAuth();

    const opcoesCurso = [
        {id: '1', titulo: 'Apostador Inteligente: Dominando o Mundo das Apostas.'},
        {id: '2', titulo: 'Apostando com Consciência: Curso de Iniciação às Apostas.'},
        {id: '3', titulo: 'Curso de Gerenciamento de Riscos em Apostas.'},
        {id: '4', titulo: 'Análise de Probabilidades: Estratégias para Apostadores.'},
        {id: '5', titulo: 'Disciplina nas Apostas: Como Manter o Controle ea Consistência.'},
    ];

    return( 
        <View style={styles.container}> 

            {/* Cabeçalho */}
            <View style={styles.header}> 
                <View style={styles.userInfo}> 
                    <Image source={require('../imgs/fotoPerfil.png')} style={styles.avatar}/>

                    <View> 
                        <Text style={styles.nome}> {usuario?.nome || 'Usuário'} </Text>
                        <Text style={styles.email}> {usuario?.email || 'email@gmail.com'} </Text>
                    </View>
                </View>

                <Image source={require('../imgs/logoXP.png')} style={styles.logo}/>
            </View>


            {/* Titulo */}
            <Text style={styles.titulo}> Acompanhe nossos Cursos! </Text>


            {/* Opções de Cursos */}
            <ScrollView contentContainerStyle={styles.lista}> 
                {opcoesCurso.map((curso) => (
                    <TouchableOpacity 
                    key={curso.id} 
                    style={styles.card}
                    onPress={() => navigation.navigate('CursoVideo', {titulo: curso.titulo})}
                    > 
                        <Ionicons name={"play"} size={32} color={"#fff"} />
                        <Text style={styles.cardTexto}> {curso.titulo} </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#1c1c1c',
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#00ff00',
    },
    nome: {
        color: '#fff',
        fontWeight: 'bold',
    },
    email: {
        color: 'white',
        fontSize: 12,
    },
    logo: {
        width: 90,
        height: 90,
        borderRadius: 10,
    },
    titulo: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 16,
        fontWeight: '600',
    },
    lista: {
        paddingHorizontal: 16,
        gap: 20,
    },
    card: {
        backgroundColor: '#111',
        height: 120,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderWidth: 2,
        borderColor: '#00ff00',
    },
    cardTexto: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 8,
    }
})

export default Cursos;