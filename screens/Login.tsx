import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from '../types/types';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;


interface FaceRecognitionResult {
  success: boolean;
  nome?: string;
  message?: string;
  confianca?: string;
}

const API_FACE_URL = 'http://192.168.15.65:5000';
const API_URL = 'http://10.0.2.2:3000';

const Login = () => {
  const navigation = useNavigation<NavigationProp>();
  const { atualizarUsuario } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [remember, setRemember] = useState(false);
  
  // Estados para reconhecimento facial
  const [modalFaceVisible, setModalFaceVisible] = useState(false);
  const [loadingFace, setLoadingFace] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/usuarios?email=${email}&senha=${senha}`);
      const data = await res.json();

      if (data.length > 0) {
        const userLogado = data[0];
        atualizarUsuario(userLogado);

        if (remember) {
          await AsyncStorage.setItem('usuario', JSON.stringify(userLogado));
        } else {
          await AsyncStorage.removeItem('usuario');
        }

        Alert.alert("Bem-Vindo!", `Login Realizado com Sucesso.`);
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        Alert.alert("Erro", "E-mail ou senha inválidos.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  };

  // Login por reconhecimento facial
  const handleFaceLogin = async () => {
    setModalFaceVisible(true);
  };

  // Processar imagem enviada
  const processarImagem = async (base64Image: string) => {
    try {
      setLoadingFace(true);

      // Envia para API de reconhecimento
      const response = await fetch(`${API_FACE_URL}/reconhecer-face`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
        }),
      });

      const data: FaceRecognitionResult = await response.json();

      if (data.success && data.nome) {
        // Face reconhecida! Busca o usuário no DB pelo email
        const userRes = await fetch(`${API_URL}/usuarios?email=${data.nome}`);
        const userData = await userRes.json();

        if (userData.length > 0) {
          const userLogado = userData[0];
          atualizarUsuario(userLogado);

          if (remember) {
            await AsyncStorage.setItem('usuario', JSON.stringify(userLogado));
          }

          setModalFaceVisible(false);
          setLoadingFace(false);

          Alert.alert("Bem-Vindo!", `${data.message || 'Login realizado'}\nReconhecimento facial: ${data.confianca || '100%'}`);
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        } else {
          setLoadingFace(false);
          Alert.alert("Erro", "Usuário não encontrado no sistema.");
        }
      } else {
        setLoadingFace(false);
        Alert.alert("Face não reconhecida", data.message || "Não foi possível reconhecer a face.");
      }
    } catch (error) {
      setLoadingFace(false);
      Alert.alert("Erro", "Não foi possível conectar ao servidor de reconhecimento facial.");
      console.error(error);
    }
  };

  // Capturar foto com câmera
  const capturarFoto = async () => {
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

      // Verifica se base64 existe
      if (!result.assets[0].base64) {
        Alert.alert("Erro", "Não foi possível processar a imagem.");
        return;
      }

      await processarImagem(result.assets[0].base64);

    } catch (error) {
      Alert.alert("Erro", "Não foi possível acessar a câmera.");
      console.error(error);
    }
  };

  // Escolher imagem da galeria
  const escolherDaGaleria = async () => {
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

      // Verifica se base64 existe
      if (!result.assets[0].base64) {
        Alert.alert("Erro", "Não foi possível processar a imagem.");
        return;
      }

      await processarImagem(result.assets[0].base64);

    } catch (error) {
      Alert.alert("Erro", "Não foi possível acessar a galeria.");
      console.error(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.topBox}>
            <Text style={styles.titulo}> Seja muito bem-vindo ao XPeriência! </Text>
            <Text style={styles.subtitulo}>
              Cada novo acesso é o começo de uma grande jornada. Conecte-se e transforme sua forma
              de apostar com Inteligência e estratégia!
            </Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#ccc"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <View style={styles.options}>
            <View style={styles.checkRow}>
              <Checkbox
                value={remember}
                onValueChange={setRemember}
                color={remember ? '#00ff7f' : undefined}
              />

              <TouchableOpacity>
                <Text style={styles.opcaoTexto}> Lembrar-me </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity>
              <Text style={styles.opcaoTexto}> Esqueceu sua Senha? </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.botao} onPress={handleLogin}>
            <Text style={styles.botaoTexto}> Entrar </Text>
          </TouchableOpacity>

          {/* Botão de Login Facial */}
          <TouchableOpacity 
            style={styles.botaoFacial} 
            onPress={handleFaceLogin}
          >
            <Text style={styles.botaoTexto}> Entrar com Reconhecimento Facial </Text>
          </TouchableOpacity>

          <Text style={styles.rodape}> Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.cadastroLink}> Cadastre-se </Text>
          </TouchableOpacity>
        </View>

        {/* Modal para captura de face */}
        <Modal
          visible={modalFaceVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitulo}>Reconhecimento Facial</Text>
              <Text style={styles.modalTexto}>
                Escolha uma opção para fazer login
              </Text>

              {loadingFace ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#009933" />
                  <Text style={styles.loadingText}>Analisando...</Text>
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.botaoCapturar}
                    onPress={capturarFoto}
                  >
                    <Text style={styles.botaoTexto}> Capturar com Câmera</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.botaoGaleria}
                    onPress={escolherDaGaleria}
                  >
                    <Text style={styles.botaoTexto}> Escolher da Galeria</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.botaoCancelar}
                    onPress={() => setModalFaceVisible(false)}
                  >
                    <Text style={styles.botaoTexto}>Cancelar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  topBox: {
    backgroundColor: '#009933',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  titulo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitulo: {
    color: '#e6e6e6',
    fontSize: 14,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2b2b2b',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    color: '#fff',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  opcaoTexto: {
    color: '#aaa',
    fontSize: 13,
  },
  botao: {
    backgroundColor: '#009933',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoFacial: {
    backgroundColor: '#00cc66',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  rodape: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 25,
  },
  cadastroLink: {
    color: '#00cc66',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: '#2b2b2b',
    padding: 30,
    borderRadius: 20,
    width: '85%',
    alignItems: 'center',
  },
  modalTitulo: {
    color: '#00ff7f',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalTexto: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
  },
  botaoCapturar: {
    backgroundColor: '#009933',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  botaoGaleria: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  botaoCancelar: {
    backgroundColor: '#cc0000',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 15,
    fontSize: 16,
  },
});

export default Login;