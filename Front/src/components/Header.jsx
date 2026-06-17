import { useAuth } from "../hooks/useAuth";
import { BookOpen, LogOut } from "lucide-react";

export function Header() {

    const { sessao, logout } = useAuth()

    return (
        <header className="w-full flex justify-between items-center py-4">

            <div className="flex items-center gap-2" >
                <BookOpen size={20} className="text-blue-600" />
                <h1 className="text-blue-600 text-xl font-bold">Biblioteca</h1>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">
                    Olá {sessao?.usuario?.nome}
                </span>

                <button 
                    onClick={logout} 
                    className="cursor-pointer text-slate-500 hover:text-red-500 transition ease-linear"
                    title="Sair do sistema"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    )
}