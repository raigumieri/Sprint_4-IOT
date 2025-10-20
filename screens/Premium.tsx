import React from "react";
import {Text, TouchableOpacity, View, StyleSheet, Image} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";


const Premium = () => {

    const {usuario} = useAuth();

    return( 
        <View style={{flex: 1, backgroundColor: '#fff'}}>

            {/* Cabeçalho */}
            <View style={styles.header}> 
                <View style={styles.userInfo}> 
                    <Image source={require('../imgs/fotoPerfil.png')} style={styles.avatar} />

                    <View>
                        <Text style={styles.userName}> {usuario?.nome || 'Usuário'} </Text>
                        <Text style={styles.email}> {usuario?.email || 'email@gmail.com'} </Text>
                    </View>
                </View>

                <Image source={require('../imgs/logoXP.png')} style={styles.logo}/>
            
            </View> 


            {/* Assinar Premium */}
            <View style={styles.premiumBox}> 
                <View style={styles.premiumContent}> 
                    <Ionicons name="star" size={40} color="#00d4aa" />

                    <View style={styles.premiumTextArea}> 
                        <Text style={styles.premiumTitle}> XPeriência Premium </Text>
                        <Text style={styles.premiumSubtitle}> Pacote de 1 ano </Text>
                    </View>
                </View>
            
                <TouchableOpacity style={styles.premiumButton}> 
                    <Text style={styles.premiumButtonText}> Assinar </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.beneficiosContainer}> 
                <Text style={styles.titulo}> Benefícios da versão Premium: </Text>

                <View style={styles.beneficio}> 
                    <Ionicons name="checkmark-circle-outline" size={20} color={"#00C851"} />
                    <Text style={styles.texto}> Acesso ilimitado a todos os cursos </Text>
                </View>

                <View style={styles.beneficio}> 
                    <Ionicons name="checkmark-circle-outline" size={20} color={"#00C851"} />
                    <Text style={styles.texto}> Conteúdos exclusivos de especialistas </Text>
                </View>

                <View style={styles.beneficio}> 
                    <Ionicons name="checkmark-circle-outline" size={20} color={"#00C851"} />
                    <Text style={styles.texto}> Suporte Prioritário </Text>
                </View>

                <View style={styles.beneficio}> 
                    <Ionicons name="checkmark-circle-outline" size={20} color={"#00C851"} />
                    <Text style={styles.texto}> Certificados Avançados </Text>
                </View>
            </View>
        </View>
    );   
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1c1c1c',
        padding: 16,
    },
    avatar: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#00ff00',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
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
    premiumBox: {
        backgroundColor: '#1a1a1a',
        margin: 20,
        padding: 20,
        borderRadius: 15,
        justifyContent: 'space-between',
    },
    premiumContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    premiumTextArea: {
        marginLeft: 15,
    },
    premiumTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    premiumSubtitle: {
        color: 'white',
        fontSize: 14,
        marginTop: 4,
    },
    premiumButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 25,
        alignSelf: 'flex-end',
        borderRadius: 8,
    },
    premiumButtonText: {
        color: 'white', 
        fontWeight: 'bold',
    },
    beneficiosContainer: {
        margin: 20,
        backgroundColor: '#1c1c1c',
        borderRadius: 15,
        padding: 15,
    },
    titulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    beneficio: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    texto: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 14,
    },
})
export default Premium;