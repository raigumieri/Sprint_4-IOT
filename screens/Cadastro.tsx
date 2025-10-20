import React, {useState} from 'react';
import {
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert, 
    Keyboard, 
    TouchableWithoutFeedback,
    ActivityIndicator,
    Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Cadastro'>;


interface FaceRegisterResult {
    success: boolean;
    message?: string;
    error?: string;
    total_cadastros?: number;
}


const API_FACE_URL = 'http://192.168.15.65:5000';
const API_URL = 'http://10.0.2.2:3000';

const Cadastro = () => {
    const navigation = useNavigation<NavigationProps>();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    
    // Estados para cadastro facial
    const [usuarioCriado, setUsuarioCriado] = useState(false);
    const [idUsuario, setIdUsuario] = useState<string | null>(null);
    const [modalFaceVisible, setModalFaceVisible] = useState(false);
    const [loadingFace, setLoadingFace] = useState(false);
    const [faceCadastrada, setFaceCadastrada] = useState(false);

    const handleCadastro = async () => {
        if(!nome || !email || !senha || !confirmarSenha) {
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }

        if(senha !== confirmarSenha) {
            Alert.alert("Erro", "As senhas não coincidem!");
            return;
        }

        try{
            const res = await fetch(`${API_URL}/usuarios?email=${email}`);
            const data = await res.json();

            if(data.length > 0) {
                Alert.alert('Erro', 'E-mail já cadastrado!');
                return;
            }

            // Cria novo usuário
            const response = await fetch(`${API_URL}/usuarios`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    nome,
                    email,
                    senha
                })
            });

            const novoUsuario = await response.json();
            setIdUsuario(novoUsuario.id);
            setUsuarioCriado(true);

            Alert.alert(
                'Sucesso!', 
                'Conta criada com sucesso!\n\nDeseja cadastrar reconhecimento facial para login mais rápido?',
                [
                    {
                        text: 'Agora não',
                        onPress: () => navigation.navigate('Login'),
                        style: 'cancel'
                    },
                    {
                        text: 'Sim, cadastrar',
                        onPress: () => setModalFaceVisible(true)
                    }
                ]
            );

        }catch (error) {
            Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
            console.error(error);
        }
    };

    // Processar imagem para cadastro facial
    const processarImagemFacial = async (base64Image: string) => {
        try {
            setLoadingFace(true);

            // Envia para API de reconhecimento
            const response = await fetch(`${API_FACE_URL}/cadastrar-face`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64Image,
                    nome: nome,
                    email: email,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setFaceCadastrada(true);
                setLoadingFace(false);
                Alert.alert(
                    'Perfeito! 🎉', 
                    'Face cadastrada com sucesso!\n\nAgora você pode fazer login apenas mostrando seu rosto!',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                setModalFaceVisible(false);
                                navigation.navigate('Login');
                            }
                        }
                    ]
                );
            } else {
                setLoadingFace(false);
                Alert.alert('Erro', data.error || 'Não foi possível cadastrar a face. Tente novamente.');
            }

        } catch (error) {
            setLoadingFace(false);
            Alert.alert('Erro', 'Não foi possível conectar ao servidor de reconhecimento facial.');
            console.error(error);
        }
    };

    // Cadastrar face com câmera
    const cadastrarFaceCamera = async () => {
        try {
            // Solicita permissão da câmera
            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão negada', 'Precisamos de acesso à câmera para reconhecimento facial.');
                return;
            }

            // Tira foto
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 0.8,
                base64: true,
            });

            if (result.canceled) {
                return;
            }

            if (!result.assets[0].base64) {
                Alert.alert("Erro", "Não foi possível processar a imagem.");
                return;
            }

            await processarImagemFacial(result.assets[0].base64);

        } catch (error) {
            Alert.alert('Erro', 'Não foi possível acessar a câmera.');
            console.error(error);
        }
    };

    // Cadastrar face da galeria
    const cadastrarFaceGaleria = async () => {
        try {
            // Solicita permissão da galeria
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão negada', 'Precisamos de acesso à galeria para selecionar uma imagem.');
                return;
            }

            // Abre galeria
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
                base64: true,
            });

            if (result.canceled) {
                return;
            }

            if (!result.assets[0].base64) {
                Alert.alert("Erro", "Não foi possível processar a imagem.");
                return;
            }

            await processarImagemFacial(result.assets[0].base64);

        } catch (error) {
            Alert.alert('Erro', 'Não foi possível acessar a galeria.');
            console.error(error);
        }
    };

    const pularCadastroFacial = () => {
        setModalFaceVisible(false);
        navigation.navigate('Login');
    };

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
            <ScrollView 
                contentContainerStyle={{flexGrow: 1}} 
                keyboardShouldPersistTaps="handled"
            > 
                <View style={styles.container}> 

                    <View style={styles.topo}> 
                        <Text style={styles.titulo}> Cria sua conta na XPeriência! </Text>
                        <Text style={styles.subtitulo}> 
                            Um mundo de oportunidades o espera. Venha descobrir uma nova forma de apostar! 
                        </Text>
                    </View>

                    <TextInput
                        style={styles.input} 
                        placeholder='Digite seu nome'
                        placeholderTextColor="#ccc"
                        value={nome}
                        onChangeText={setNome}
                    />

                    <TextInput
                        style={styles.input} 
                        placeholder='Digite seu e-mail'
                        placeholderTextColor="#ccc"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType='email-address'
                        autoCapitalize='none'
                    />

                    <TextInput
                        style={styles.input} 
                        placeholder='Digite sua senha'
                        placeholderTextColor="#ccc"
                        secureTextEntry
                        value={senha}
                        onChangeText={setSenha}
                    />

                    <TextInput
                        style={styles.input} 
                        placeholder='Confirme sua senha'
                        placeholderTextColor="#ccc"
                        secureTextEntry
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                    />

                    <TouchableOpacity 
                        style={styles.botao} 
                        onPress={handleCadastro}
                    > 
                        <Text style={styles.textoBotao}>Cadastrar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')}> 
                        <Text style={styles.loginLink}> 
                            Já tem uma conta? <Text style={styles.loginTexto}>Entrar</Text> 
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Modal para cadastro facial */}
                <Modal
                    visible={modalFaceVisible}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitulo}>🔐 Cadastro Facial</Text>
                            
                            {!faceCadastrada ? (
                                <>
                                    <Text style={styles.modalTexto}>
                                        Cadastre seu rosto para fazer login de forma rápida e segura!
                                    </Text>
                                    
                                    <View style={styles.beneficiosContainer}>
                                        <Text style={styles.beneficioItem}>✓ Login instantâneo</Text>
                                        <Text style={styles.beneficioItem}>✓ Mais segurança</Text>
                                        <Text style={styles.beneficioItem}>✓ Sem digitar senha</Text>
                                    </View>

                                    {loadingFace ? (
                                        <View style={styles.loadingContainer}>
                                            <ActivityIndicator size="large" color="#00ff7f" />
                                            <Text style={styles.loadingText}>Processando sua face...</Text>
                                        </View>
                                    ) : (
                                        <>
                                            <TouchableOpacity
                                                style={styles.botaoCapturar}
                                                onPress={cadastrarFaceCamera}
                                            >
                                                <Text style={styles.textoBotao}>📷 Capturar com Câmera</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.botaoGaleria}
                                                onPress={cadastrarFaceGaleria}
                                            >
                                                <Text style={styles.textoBotao}>🖼️ Escolher da Galeria</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.botaoPular}
                                                onPress={pularCadastroFacial}
                                            >
                                                <Text style={styles.textoBotao}>Pular (fazer depois)</Text>
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </>
                            ) : (
                                <View style={styles.sucessoContainer}>
                                    <Text style={styles.sucessoIcone}>✅</Text>
                                    <Text style={styles.sucessoTexto}>Face cadastrada com sucesso!</Text>
                                    <Text style={styles.sucessoSubtexto}>
                                        Agora você pode fazer login mostrando seu rosto
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111',
        padding: 20,
    },
    topo: {
        backgroundColor: 'green',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        marginTop: 10,
    },
    titulo: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitulo: {
        color: '#f0f0f0',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 10,
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
    },
    botao: {
        backgroundColor: 'green',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    textoBotao: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loginLink: {
        textAlign: 'center',
        color: '#aaa',
    },
    loginTexto: {
        color: '#fff',
        fontWeight: 'bold',
    },
    // Estilos do Modal
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    modalContent: {
        backgroundColor: '#1a1a1a',
        padding: 30,
        borderRadius: 20,
        width: '90%',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#00ff7f',
    },
    modalTitulo: {
        color: '#00ff7f',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalTexto: {
        color: '#fff',
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    beneficiosContainer: {
        alignSelf: 'stretch',
        backgroundColor: '#0d0d0d',
        padding: 15,
        borderRadius: 10,
        marginBottom: 25,
    },
    beneficioItem: {
        color: '#00ff7f',
        fontSize: 14,
        marginVertical: 5,
        fontWeight: '600',
    },
    botaoCapturar: {
        backgroundColor: 'green',
        padding: 16,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
    },
    botaoGaleria: {
        backgroundColor: '#0066cc',
        padding: 16,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
    },
    botaoPular: {
        backgroundColor: '#444',
        padding: 16,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    loadingContainer: {
        padding: 30,
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: 20,
        fontSize: 16,
    },
    sucessoContainer: {
        alignItems: 'center',
        padding: 20,
    },
    sucessoIcone: {
        fontSize: 60,
        marginBottom: 15,
    },
    sucessoTexto: {
        color: '#00ff7f',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    sucessoSubtexto: {
        color: '#ccc',
        fontSize: 14,
        textAlign: 'center',
    },
});

export default Cadastro;