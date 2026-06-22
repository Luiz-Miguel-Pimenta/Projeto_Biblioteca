import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { AxiosError } from "axios";

import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";

import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function Emprestimos() {
    const [emprestimos, setEmprestimos] = useState([]);
    const [busca, setBusca] = useState("")

    const { sessao } = useAuth();

    async function carregarEmprestimos() {
        try {
            const response = await api.get(sessao?.usuario?.perfil === "bibliotecario" 
                ? "/emprestimo/listar" 
                : "/emprestimo/emprestimos-leitor"
            )
            
            setEmprestimos(response.data); 

        } catch (error) {
            console.log(error);

            if(error instanceof AxiosError) {
                return alert(error.response?.data.message);
            };
            
            alert("Não foi possível carregar");
        }
    }

    useEffect(() =>{
        carregarEmprestimos()
    }, [])

    const emprestimosFiltrados = emprestimos.filter(emprestimo => 
        String(emprestimo.id).includes(busca)
    )

    return (
        <div className="flex flex-col flex-1 bg-blue-100 p-6 rounded-2xl shadow-sm border border-blue-200 overflow-hidden">
            <div className="flex flex-col items-center gap-4 shrink-0 mb-6">
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-extrabold text-slate-800">
                        {sessao?.usuario?.perfil === "bibliotecario" ? "Empréstimos" : "Meus Empréstimos"}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {sessao?.usuario?.perfil === "bibliotecario" 
                            ? "Consulte o status e o histórico dos empréstimos dos leitores."
                            : "Consulte o status e o histórico dos seus empréstimos de livros."
                        }
                    </p>
                </div>

                <div className="w-full relative"> 
                    <Input 
                        placeholder="Pesquisar por id..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                    <Search className="absolute right-3 top-3 text-slate-400" size={20} />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">

            </div>
        </div>
    )
} 