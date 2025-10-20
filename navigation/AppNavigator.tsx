import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {Ionicons} from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

// Telas
import Treino from '../screens/Treino';
import Configuracoes from '../screens/Configuracoes';
import Premium from '../screens/Premium';
import CursosStack from "./CursosStack";
import Login from '../screens/Login';
import Cadastro from '../screens/Cadastro';
import EditarConta from "../screens/EditarConta";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

//Tabs Principais (Depois do Login)
const MainTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
                backgroundColor: '#1c1c1c',
            },
            tabBarActiveTintColor: '#00ff7f',
            tabBarInactiveTintColor: '#aaa',
            tabBarIcon: ({color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap;

                switch(route.name) {
                    case 'Cursos': 
                        iconName = 'book-outline';
                        break;
                    case 'Treino': 
                        iconName = 'barbell-outline';
                        break;
                    case 'Ajustes': 
                        iconName = 'settings-outline';
                        break;
                    case 'Premium':
                        iconName = 'star-outline';
                        break;
                    default:
                        iconName = 'ellipse-outline';
                }


                return <Ionicons name={iconName} size={size} color={color} />;
            }
        })}> 
        <Tab.Screen name="Cursos" component={CursosStack} />
        <Tab.Screen name="Treino" component={Treino} />
        <Tab.Screen name="Ajustes" component={Configuracoes} />
        <Tab.Screen name="Premium" component={Premium} />
        
        
    </Tab.Navigator>
);


//Tela Inicial do App
const AppNavigator = () => {
    const {usuario} = useAuth();
    
    return(
        <NavigationContainer > 
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            
                {usuario ? (
                    //Se a pessoa estiver logada, mostra a tela de Menu
                    <Stack.Screen name="MainTabs" component={MainTabs} />

                    
                ): (
                    //Caso contrario, mostra a tela de Login e Cadastro
                    <>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Cadastro" component={Cadastro} />
                    </>
                )} 

                <Stack.Screen name="EditarConta" component={EditarConta} />
            </Stack.Navigator>

            
        </NavigationContainer>
    );
}

export default AppNavigator;