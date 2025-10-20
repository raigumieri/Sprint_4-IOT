import React from "react";
import AppNavigator from "./navigation/AppNavigator";
import CursosStack from "./navigation/CursosStack";
import { GestureHandlerRootView} from "react-native-gesture-handler";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <GestureHandlerRootView>
      <AuthProvider>
        <AppNavigator /> 
      </AuthProvider>
    </GestureHandlerRootView>
  );
}


