import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Usuario = { 
    id: string;
    nome: string;
    email: string;
};

type AuthContextType = {
    usuario: Usuario | null;
    login: (email: string, senha: string) => Promise<void>;
    logout: () => Promise<void>;
    atualizarUsuario: (novosDados: Usuario) => void; 
};

const AuthContext = createContext<AuthContextType>({
    usuario: null,
    login: async () => {},
    logout: async () => {},
    atualizarUsuario: () => {}, 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    const login = async (email: string, senha: string) => {
        try {
            const response = await fetch('http://10.0.2.2:3000/usuarios');
            const usuarios = await response.json();

            const usuarioEncontrado = usuarios.find(
                (u: Usuario) => u.email === email
            );

            if (usuarioEncontrado) {
                await AsyncStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
                setUsuario(usuarioEncontrado);

            }else {
                throw new Error('Usuário não encontrado');
            } 

        } catch (error) {
                console.error('Erro ao fazer login:', error);
                throw error;
        }
    };


    const logout = async () => {
        await AsyncStorage.removeItem('usuario');
        setUsuario(null);
    };

    const atualizarUsuario = (novosDados: Usuario) => {
        setUsuario(novosDados);
    };

    useEffect(() => {
        const carregarUsuario = async () => {

            try{
                const usuarioSalvo = await AsyncStorage.getItem('usuario');
                console.log("Usuário salvo no AsyncStorage:", usuarioSalvo);
                if (usuarioSalvo) {
                    setUsuario(JSON.parse(usuarioSalvo));
                }    

            }catch (error) {
                console.error("Erro ao carregar usuário do AsyncStorage", error);
            }
            
        };

        carregarUsuario();
    }, []);

    return (
        <AuthContext.Provider value={{ 
            usuario, 
            login, 
            logout,
            atualizarUsuario 
        }}>
            {children}
        </AuthContext.Provider>
    );
}
    
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
};

