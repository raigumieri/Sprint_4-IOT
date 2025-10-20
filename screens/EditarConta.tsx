import React, {useEffect, useState} from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../types/types";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const EditarConta = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { logout, atualizarUsuario } = useAuth(); 

    const [user, setUser] = useState<any>(null);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    useEffect(() => {
        const carregarUsuario = async () => {
        try {
            const usuarioLogado = await AsyncStorage.getItem("usuario");
            if (usuarioLogado) {
                const dados = JSON.parse(usuarioLogado);
                setUser(dados);
                setNome(dados.nome);
                setEmail(dados.email);
                setSenha(dados.senha);
            }
        }catch (error) { 
            console.log("Erro ao carregar dados do usuário:", error);
        }
    };

    carregarUsuario();

}, []);


const salvarAlteracoes = async () => {
    if (!nome || !email || !senha) {
        Alert.alert("Atenção", "Preencha todos os campos antes de salvar!");
        return;
    }

    try {
        const response = await fetch(`http://10.0.2.2:3000/usuarios/${user.id}`, {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ nome, email, senha }),
        });

        if (response.ok) {
            const usuarioAtualizado = {...user, nome, email, senha };
            await AsyncStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
            atualizarUsuario(usuarioAtualizado); // Adicione esta linha
            Alert.alert("Sucesso", "Dados atualizados com sucesso!");
            navigation.goBack();
        } else {
            const errorData = await response.json();
            Alert.alert("Erro", errorData.message || "Não foi possível atualizar os dados.");
        }
    } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Falha ao se conectar ao servidor.");
    }
};

    const excluirConta = () => {
        Alert.alert(
            "Excluir Conta",
            "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
            [
                {text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try{
                            await fetch(`http://10.0.2.2:3000/usuarios/${user.id}`, {
                                method: "DELETE",
                            });
                            await logout();
                            Alert.alert("Conta Excluída", "Sua conta foi excluída com sucesso.",
                                [
                                    {
                                        text: "OK",
                                        onPress: () => {
                                            navigation.reset({
                                                index: 0,
                                                routes: [{ name: 'Login' as keyof RootStackParamList }],
                                            });
                                        }
                                    }
                                ]
                            );

                        }catch (error) {
                            console.error(error);
                            Alert.alert("Erro", "Não foi possível excluir sua conta.");
                        }
                    },
                },
            ]
        );

}; 

    return(
        <KeyboardAvoidingView
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Editar Conta</Text> 

                <TextInput 
                    style={styles.input}
                    placeholder="Nome"
                    placeholderTextColor="#888"
                    value={nome}
                    onChangeText={setNome}
                />

                <TextInput 
                    style={styles.input}
                    placeholder="E-mail"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput 
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor="#888"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.saveButton} onPress={salvarAlteracoes}>
                    <Text style={styles.saveText}>Salvar Alterações</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={excluirConta}>
                    <Text style={styles.deleteText}>Excluir Conta</Text>
                </TouchableOpacity>

            </ScrollView>

        </KeyboardAvoidingView>
    )
};

export default EditarConta;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },

    content: {
        padding: 20,
        alignItems: 'center',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00ff7f',
        marginBottom: 20,
    },

    input: {
        width: '100%',
        backgroundColor: '#1c1c1c',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333',
        color: '#fff',
    },

    saveButton: {
        width: '100%',
        backgroundColor: '#00ff7f',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },

    saveText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },

    deleteButton: {
        width: '100%',
        backgroundColor: '#ff4040',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
    },

    deleteText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    
});



