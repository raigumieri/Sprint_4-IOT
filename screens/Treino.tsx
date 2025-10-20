import React, {useState} from "react";
import {Text, View, TouchableOpacity, StyleSheet, Alert, Image, TextStyle} from "react-native";
import { useAuth } from "../context/AuthContext";

const Treino = () => {

  const {usuario} = useAuth();

  type Resultado = 'A' | 'empate' | 'B' | null;
  type Escolha = 'A' | 'empate' | 'B';

  const [resultado, setResultado] = useState<Resultado>(null);
  const [escolha, setEscolha] = useState<Resultado>(null);

  const evento = {
    timeA: 'Time A',
    timeB: 'Time B',
    odds: {
      A: 2.1,
      empate: 3.4,
      B: 1.7
    }
  };

  const simularResultado = (escolha: Escolha) => {
    setEscolha(escolha);

    const opcoes: Escolha[] = ['A', 'empate', 'B'];
    const vencedor = opcoes[Math.floor(Math.random() * 3)];

    if (escolha === vencedor) {
      Alert.alert('Você acertou!', `Parabéns! Você teria ganhando ${evento.odds[escolha]}x o valor.`);
    }else {
      const vencedorTexto = 
      vencedor === 'A' ? evento.timeA :
      vencedor === 'B' ? evento.timeB :
      'Empate';
      Alert.alert('Você errou', `O resultado foi: ${vencedorTexto}`);
    }

    setResultado(vencedor);
  };

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

          {/* Introdução */}
          <View style={styles.introBox}> 
            <Text style={styles.introText}> Aqui você poderá fazer apostas sem medo de perda. </Text>
          </View>

          {/* Evento */}
          <View style={styles.eventBox}> 
            <Text style={styles.versus}> {evento.timeA} vs {evento.timeB} </Text>
          

            <TouchableOpacity style={styles.btn} onPress={() => simularResultado('A')}>
              <Text> Apostar no {evento.timeA} - Odds {evento.odds.A} </Text> 
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => simularResultado('empate')}>
              <Text> Apostar no Empate - Odds {evento.odds.empate} </Text> 
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => simularResultado('B')}>
              <Text> Apostar no {evento.timeB} - Odds {evento.odds.B} </Text> 
            </TouchableOpacity>
          </View>

          {resultado !== null && (
            <View style={styles.resultadoBox}>
              <Text style={[
                styles.resultadoTexto,
                resultado === escolha ? styles.resultadoGanhou : styles.resultadoPerdeu,
              ]}> {resultado === escolha ? 'Você Ganhou!' : `Você perdeu. Resultado: ${resultado}` }</Text> 
            </View>
          )}
            
        </View>
      );
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
  introBox: {
    backgroundColor: '#1c1c1c',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#00ff00',
  },
  introText: {
    color: 'white',
    textAlign: 'center',
  },
  eventBox: {
    backgroundColor: '#1c1c1c',
    padding: 15,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#00ff00',
  },
  versus: {
    fontSize: 16,
    fontWeight: 'bold', 
    textAlign: 'center',
    color: 'white',
    marginBottom: 15,
  },
  btn: {
    backgroundColor: '#ddd',
    padding: 10,
    marginVertical: 5,
    borderRadius: 6,
    alignItems: 'center',
  },
  resultadoBox: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  resultadoTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  resultadoGanhou: {
    color: '#00C851',
  },
  resultadoPerdeu: {
    color: '#ff4444',
  },


});

export default Treino;