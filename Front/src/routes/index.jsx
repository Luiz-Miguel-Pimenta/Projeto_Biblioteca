import { BrowserRouter } from "react-router";

import { useAuth } from "../hooks/useAuth";
import { Loading } from "../components/Loading"

import { BibliotecarioRoutes } from "./BibliotecarioRoutes";
import { LeitorRoutes } from "./LeitorRoutes";
import { LogarRoutes } from "./LogarRoutes";

export function AppRoutes() {
    const { sessao, isLoading } = useAuth();

    function Route() {

        switch (sessao?.usuario?.perfil) {
            case "bibliotecario":
                return <BibliotecarioRoutes />
            case "leitor": 
                return <LeitorRoutes />
            default:
                return <LogarRoutes />
        };
    };

    if(isLoading) {
        return <Loading />
    };

    return (
        <BrowserRouter>
            <Route />
        </BrowserRouter>
    )
};