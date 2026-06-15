import { useNavigate } from "react-router";
import { BookX } from "lucide-react";

export function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-slate-100">
            <div className="flex flex-col items-center text-center max-w-md">

                <BookX size={80} className="text-blue-600 mb-6" />

                <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
                    Ops! Página não encontrada
                </h1>

                <p className="text-slate-500 mb-6">
                    A página que você tentou acessar não existe ou foi movida. Verifique o endereço e tente novamente.
                </p>

                <button 
                    onClick={() => navigate("/")} 
                    className=" text-blue-600 mt-2 
                                font-bold hover:text-blue-950 
                                transition ease-linear cursor-pointer"
                >
                    Voltar para o início
                </button>
            </div>
        </div>
    )
}