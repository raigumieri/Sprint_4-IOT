import React, {useState} from "react";
import {Text, View, StyleSheet, Switch, TouchableOpacity, Image, Alert} from "react-native";
import {FontAwesome, Entypo, MaterialIcons} from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const Configuracoes = () => {
    const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const navigation = useNavigation<any>();

    const {usuario, logout} = useAuth();

    const handleLogout = () => {
        Alert.alert(
            "Sair",
            "Deseja realmente sair da sua conta?",
            [
                {text: "Cancelar", style: "cancel"},
                {text: "Sair", onPress: async () => {
                    await logout();
                }}
            ]

        )
    }

    return( 
        <View style={styles.container}> 

            {/* Cabecalho */}
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
            
            {/* Bloco de Opções */}
            <View style={styles.switchBox}>  

                <View style={styles.switchRow}> 
                    <Switch
                    value={notificacoesAtivas}
                    onValueChange={setNotificacoesAtivas}
                    thumbColor="#fff"
                    trackColor={{true: 'green', false: '#777'}} 
                    />
                    <Text style={styles.switchLabel}> Notificações </Text>
                </View>

                <View style={styles.switchRow}> 
                    <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    thumbColor="#fff"
                    trackColor={{true: 'green', false: '#777'}}
                    />
                    <Text style={styles.switchLabel}> Dark Mode </Text>
                </View>

                <TouchableOpacity style={styles.termosUso}> 
                    <Text style={styles.termosUsoTexto}> Termos de Uso </Text>
                </TouchableOpacity>       
            </View>

            {/* Bloco de Contato */}
                <View style={styles.contatoBox}> 
                    <Text style={styles.contatoTitulo}> Contatos </Text>

                    <View style={styles.contatoContainer}>
                        <View style={styles.contatoItem}> 
                            <FontAwesome name="whatsapp" size={24} color="white" />
                            <Text style={styles.contatoTexto}> 11 943347167 </Text>
                        </View>

                        <View style={styles.contatoItem}> 
                            <Entypo name="mail" size={24} color="white" />
                            <Text style={styles.contatoTexto}> XPeriencia@gmail.com </Text>
                        </View>

                        <View style={styles.contatoItem}> 
                            <MaterialIcons name="call" size={24} color="white" />
                            <Text style={styles.contatoTexto}> 97112-5488 </Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditarConta")}>
                    <Text style={styles.optionText}>Editar Conta</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}> 
                    <Text style={styles.logoutText}> Sair da Conta </Text>
                </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#1e1e1e',
        padding: 16,
        alignItems: 'center',
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
    switchBox: {
        marginTop: 30,
        backgroundColor: '#1e1e1e',
        marginLeft: 10,
        marginRight: 10,
        padding: 10,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'green',
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    switchLabel: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
    },

    
    editButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "green",
        borderRadius: 10,
        alignItems: 'center',
        width: '50%',
        alignSelf: 'center',
    },

    optionText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: 'bold',
    },

    logoutButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "green",
        borderRadius: 10,
        alignItems: 'center',
        width: '50%',
        alignSelf: 'center',
    },
    logoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: 'bold',
    },



    termosUso: {
        marginTop: 20,
        alignSelf: 'center',
    },
    termosUsoTexto: {
        color: 'white',
        fontWeight: 'bold',
    },
    contatoBox: {
        backgroundColor: '#1e1e1e',
        borderRadius: 15,
        marginLeft: 10,
        marginRight: 10,
        padding: 10,
        marginTop: 30,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'green',
    },
    contatoTitulo: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 15,
        fontSize: 16,
    },
    contatoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contatoItem: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    contatoTexto: {
        color: "white",
        fontSize: 12,
        marginTop: 5,
        textAlign: 'center',
    },
})
export default Configuracoes;