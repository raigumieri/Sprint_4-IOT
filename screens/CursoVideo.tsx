import React, {useState} from 'react';
import {Text, View, StyleSheet, ScrollView, Image} from 'react-native';
import { TouchableOpacity } from 'react-native';
import { CursosStackParamList } from '../types/types';
import { RouteProp, useRoute } from '@react-navigation/native';
import {Ionicons} from "@expo/vector-icons";
import { useAuth } from '../context/AuthContext';

type CursoVideoRouteProp = RouteProp<CursosStackParamList, 'CursoVideo'>;

const CursoVideo = () => {
    const route = useRoute<CursoVideoRouteProp>();
    const {titulo} = route.params;

    const {usuario} = useAuth();

    const [capituloSelecionado, setCapituloSelecionado] = useState(1);

    const capitulos = [
        'Capítulo 1',
        'Capítulo 2',
        'Capítulo 3',
        'Capítulo 4',
        'Capítulo 5',
    ];

    return(
        <ScrollView style={styles.container}> 

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

            {/* Titulo do Curso*/}
            <Text style={styles.titulo}> {titulo} </Text>

            {/* Simulador de Video */}
            <View style={styles.videoBox}> 
               <Ionicons name={"play"} size={32} color={"#fff"} />
            </View>

            {/* Lista de Capítulo */}
            {capitulos.map((capitulo, index) => (
                <TouchableOpacity
                key={index}
                style={[
                    styles.capituloBtn,
                    capituloSelecionado === index + 1 && styles.capituloBtnSelecionado,
                ]}
                onPress={() => setCapituloSelecionado(index + 1)}
                > 
                    <Text style={styles.capituloTexto}> {capitulo} </Text>
                </TouchableOpacity>
            ))}

            {/* Botões de Navegação */}
            <View style={styles.navegacao}> 
                <TouchableOpacity style={styles.navBtn}> 
                    <Text style={styles.navText}> Vídeo Anterior </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navBtn}> 
                    <Text style={styles.navText}> Próximo Vídeo </Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create ({
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
        color: '#ccc',
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
    videoBox: {
        height: 180,
        backgroundColor: '#1c1c1c',
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: '#00ff5b',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    capituloBtn: {
        backgroundColor: '#1c1c1c',
        padding: 12,
        marginVertical: 5,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    capituloBtnSelecionado: {
        borderColor: '#00ff5b',
        borderWidth: 2,
    },
    capituloTexto: {
        color: 'white',
        fontSize: 14,
    },

    navegacao: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    navBtn: {
        backgroundColor: '#00ff5b',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    navText: {
        fontWeight: 'bold',
    },


});

export default CursoVideo;