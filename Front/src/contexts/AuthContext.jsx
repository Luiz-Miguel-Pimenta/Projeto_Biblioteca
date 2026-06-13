import { useState, useEffect, createContext } from "react";

import { api } from "../services/api";

export const AuthContext = createContext({}) 

export function AuthProvider({ children }) {
    const [sessao, setSessao] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const CHAVE_LOCAL_STORAGE = "@biblioteca";

    async function login(data) {
        localStorage.setItem(`${CHAVE_LOCAL_STORAGE}:usuario`, JSON.stringify(data.usuario));
        localStorage.setItem(`${CHAVE_LOCAL_STORAGE}:token`, data.token);

        setSessao(data)
    }

    function logout() {
        localStorage.removeItem(`${CHAVE_LOCAL_STORAGE}:usuario`);
        localStorage.removeItem(`${CHAVE_LOCAL_STORAGE}:token`);

        setSessao(null)
    }

    function carregarUsuario() {
        const usuario = localStorage.getItem(`${CHAVE_LOCAL_STORAGE}:usuario`);
        const token = localStorage.getItem(`${CHAVE_LOCAL_STORAGE}:token`);

        if (usuario && token) {
            setSessao({
                token,
                usuario: JSON.parse(usuario)
            })
        }

        setIsLoading(false);
    }

    useEffect(() => {
        carregarUsuario();
    }, []);

    return(
        <AuthContext.Provider value={{ sessao, login, logout, isLoading }}>
            { children }
        </AuthContext.Provider>
    )
}
    