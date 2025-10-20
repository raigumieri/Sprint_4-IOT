import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Cursos from '../screens/Cursos';
import CursoVideo from "../screens/CursoVideo";


const Stack = createNativeStackNavigator();

const CursosStack = () => {
    return(
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CursosHome" component={Cursos} />
            <Stack.Screen name="CursoVideo" component={CursoVideo} />
        </Stack.Navigator>
    )
}

export default CursosStack;