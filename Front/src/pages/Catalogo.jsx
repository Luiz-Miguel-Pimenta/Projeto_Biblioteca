import { useState, useEffect } from "react";
import { Search, Edit, Trash2 } from "lucide-react";
import { AxiosError } from "axios";

import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";

import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { LivroCard } from "../components/LivroCard";

export function Catalogo() {
    const [livros, setLivros] = useState([]);
    const [busca, setBusca] = useState("");

    const { sessao } = useAuth()

    async function carregarLivros() {
        try {
            const response = await api.get("/livro/listar");

            setLivros(response.data);

            console.log(response.data);
            
        } catch (error) {
            console.log(error);

            if(error instanceof AxiosError) {
                return alert(error.response?.data.message);
            };
            
            alert("Não foi possível carregar");
        }
    }

    useEffect(() =>{
        carregarLivros()
    }, [])

    const livrosFiltrados = livros.filter((livro) =>
        livro.titulo.toLowerCase().includes(busca.toLowerCase())
    );

    async function excluirLivro(id) {
        if(confirm("Deseja excluir este livro?")) {
            try {
                await api.delete(`/livro/deletar/${id}`);

                setLivros(livros.filter(livro => livro.id !== id));
                
                alert(`Livro ${id} excluido com sucesso!`);

            } catch (error) {
                console.log(error);
                if(error instanceof AxiosError) {
                    return alert(error.response?.data?.message || "Erro ao excluir o livro.");
                }
                alert("Não foi possível excluir o livro.");
            }
        }
    }

    async function gerarEmprestimo(id) {
        if(confirm("Deseja gerar empréstimo para este livro?")) {
            try {
                await api.post("/emprestimo/criar", {
                    livro_id: id
                })

                setLivros((livrosAntigos) => {
                    return livrosAntigos.map((livro) => {
                        if (livro.id === id) {
                            return { 
                                ...livro, 
                                quantidade_disponivel: livro.quantidade_disponivel - 1,
                            }
                        }

                        return livro;
                    })
                })

                alert(`Empréstimo gerado com sucesso!`);

            } catch (error) {
                console.log(error);
                if(error instanceof AxiosError) {
                    return alert(error.response?.data?.message || "Erro ao gerar o empréstimo.");
                }
                alert("Não foi possível gerar o empréstimo.");
            }
            
        }
    }

    return (
        <div className="flex flex-col gap-8">

            <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-extrabold text-slate-800">Catálogo de Livros</h1>
                    <p className="text-slate-500 text-sm">Explore o nossa biblioteca e encontre sua próxima leitura.</p>
                </div>

                <div className="w-full flex gap-5"> 
                    {sessao?.usuario?.perfil === "bibliotecario" && (
                        <Button className="flex-1 w-auto" onClick={() => alert("Abrirá o modal de cadastro")}>
                            Adicionar Livro
                        </Button>
                    )}
                    
                    <div className="w-full relative flex-1">
                        <Input 
                            placeholder="Pesquisar por título..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                        <Search className="absolute right-3 top-3 text-slate-400" size={20} />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {livrosFiltrados.map((livro) => (
                    <LivroCard key={livro.id} livro={livro}>
                        {sessao?.usuario?.perfil === "bibliotecario" ? (
                            <>
                                <button
                                    onClick={() => alert("Abrirá a sobreposição de edição")}
                                    className="p-2 rounded hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition"
                                    title="Editar Livro"
                                >
                                    <Edit size={20} />
                                </button>

                                <button
                                    onClick={() => excluirLivro(livro.id)}
                                    className="p-2 rounded hover:bg-slate-100 text-slate-500 hover:text-red-600 transition"
                                    title="Excluir Livro"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </>
                        ) : (
                            <Button
                                onClick={() => gerarEmprestimo(livro.id)}
                                className="h-10 px-6"
                                disabled={livro.quantidade_disponivel === 0}
                            >
                                Gerar Empréstimo
                            </Button>

                        )}

                    </LivroCard>
                ))}

                {livrosFiltrados.length === 0 && (
                    <p className="text-center text-slate-500 mt-10">
                        Nenhum livro encontrado
                    </p>
                )}

            </div>
        </div>
    )
}