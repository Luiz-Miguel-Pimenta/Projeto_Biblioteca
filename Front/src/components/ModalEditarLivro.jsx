import { useState, useEffect } from "react";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";
import { api } from "../services/api"; 

import { Input } from "./Input";     
import { Button } from "./Button";

const livroSchema = z.object({
    titulo: z.string().trim().min(1, { message: "O título é obrigatório" }),
    autor: z.string().trim().min(1, { message: "O autor é obrigatório" }),
    ano_publicacao: z.coerce.number().min(1000, { message: "Digite um ano válido" }),
    quantidade_disponivel: z.coerce.number().min(0, { message: "A quantidade não pode ser negativa" }),
});


export function ModalEditarLivro({ idLivro, onClose }) {
    const [titulo, setTitulo] = useState("");
    const [autor, setAutor] = useState("");
    const [ano, setAno] = useState("");
    const [quantidade, setQuantidade] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

   
    useEffect(() => {
        async function buscarDadosDoLivro() {
            try {
                
                const response = await api.get(`/livro/buscar/${idLivro}`); 
                const livroAtual = response.data;
                
                
                setTitulo(livroAtual.titulo);
                setAutor(livroAtual.autor);
                setAno(livroAtual.ano_publicacao);
                setQuantidade(livroAtual.quantidade_disponivel);
            } catch (error) {
                console.log(error);
                alert("Não foi possível carregar os dados deste livro.");
                onClose(); 
            } finally {
                setIsFetching(false);
            }
        }
        buscarDadosDoLivro();
    }, [idLivro]); 

    async function onSubmit(e) {
        e.preventDefault();

        try {
            setIsLoading(true);
            const data = livroSchema.parse({ titulo, autor, ano_publicacao: ano, quantidade_disponivel: quantidade });

            
            await api.put(`/livro/atualizar/${idLivro}`, {
                titulo: data.titulo,
                autor: data.autor,
                ano_publicacao: data.ano_publicacao,
                quantidade_disponivel: data.quantidade_disponivel
            });

            alert("Livro atualizado com sucesso!");
            onClose(); 

        } catch (error) {
            console.log(error);
            if(error instanceof AxiosError) return alert(error.response?.data.message || "Erro de Servidor");
            if(error instanceof ZodError) return alert(error.issues[0].message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            
           
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
                
                
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 font-bold"
                >
                    X
                </button>

                <h2 className="text-xl font-bold mb-4">Editar Livro (ID: {idLivro})</h2>
                
                {isFetching ? (
                    <p className="text-center text-slate-500 py-8">Carregando dados...</p>
                ) : (
                    <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
                        <Input legend="Título do Livro" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                        <Input legend="Autor" value={autor} onChange={(e) => setAutor(e.target.value)} />
                        
                        <div className="flex gap-4">
                            <div className="w-full">
                                <Input legend="Ano de Publicação" type="number" value={ano} onChange={(e) => setAno(e.target.value)} />
                            </div>
                            <div className="w-full">
                                <Input legend="Quantidade" type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
                            </div>
                        </div>

                        <Button type="submit" isLoading={isLoading}>Salvar Alterações</Button>
                    </form>
                )}
            </div>
        </div>
    );
}