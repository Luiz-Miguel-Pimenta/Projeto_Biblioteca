import { NavLink, useNavigate } from "react-router"
import { BookOpen, LogOut } from "lucide-react";

import { useAuth } from "../hooks/useAuth";

export function Header() {

    const { sessao, logout } = useAuth();
    const navigate = useNavigate();

    function deslogar() {
        logout();
        navigate("/");
    }

    return (
        <header className="w-full flex justify-between items-center py-4">

            <div className="flex items-center gap-2" >
                <BookOpen size={20} className="text-blue-600" />
                <h1 className="text-blue-600 text-xl font-bold">Biblioteca</h1>
            </div>

            <nav className="flex gap-6">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => 
                        isActive
                        ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
                        : "text-slate-500 font-semibold hover:text-blue-600 transition ease-linear pb-1"
                    }
                >   
                    Catálogo
                </NavLink>

                <NavLink
                    to="/emprestimos"
                    className={({ isActive }) => 
                        isActive
                        ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
                        : "text-slate-500 font-semibold hover:text-blue-600 transition ease-linear pb-1"
                    }
                >
                    Empréstimos
                </NavLink>
            </nav>

            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">
                    Olá {sessao?.usuario?.nome}
                </span>

                <button 
                    onClick={deslogar} 
                    className="cursor-pointer text-slate-500 hover:text-red-500 transition ease-linear"
                    title="Sair do sistema"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    )
}