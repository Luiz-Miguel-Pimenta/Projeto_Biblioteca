import { useState, useEffect } from "react";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";
import { api } from "../services/api"; 
import { Undo2 } from 'lucide-react';

import { Input } from "./Input";     
import { Button } from "./Button";

const livroSchema = z.object({
    titulo: z.string().trim().min(1, { message: "O título é obrigatório" }),
    autor: z.string().trim().min(1, { message: "O autor é obrigatório" }),
    ano_publicacao: z.coerce.number().int().min(1000, { message: "Digite um ano válido" }).max(new Date().getFullYear()),
    quantidade_disponivel: z.coerce.number().min(0, { message: "A quantidade não pode ser negativa" }),
});

export function ModalEditarLivro({ idLivro, onClose, onSuccess }) {
    const [titulo, setTitulo] = useState("");
    const [autor, setAutor] = useState("");
    const [ano_publicacao, setAno_publicacao] = useState("");
    const [quantidade_disponivel, setQuantidade_disponivel] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    async function buscarDadosDoLivro() {
        try {
            const response = await api.get(`/livro/buscar/${idLivro}`); 
            const livroSelecionado = response.data;
                
            setTitulo(livroSelecionado.titulo);
            setAutor(livroSelecionado.autor);
            setAno_publicacao(livroSelecionado.ano_publicacao);
            setQuantidade_disponivel(livroSelecionado.quantidade_disponivel);
        } catch (error) {
            console.log(error);

            if(error instanceof AxiosError) {
                return alert(error.response?.data?.message || "Erro de Server: Tente mais tarde");
            }

            alert("Não foi possível carregar os dados deste livro.");

            onClose(); 
        } finally {
            setIsFetching(false);
        }
    }
   
    useEffect(() => {
        buscarDadosDoLivro();
    }, [idLivro]); 

    async function onSubmit(e) {
        e.preventDefault();

        try {
            setIsLoading(true);

            const data = livroSchema.parse({ titulo, autor, ano_publicacao, quantidade_disponivel });

            await api.put(`/livro/atualizar/${idLivro}`, data);

            alert("Livro atualizado com sucesso!");

            onSuccess();
            onClose(); 

        } catch (error) {
            console.log(error);

            if(error instanceof AxiosError) {
                return alert(error.response?.data?.message || "Erro de Servidor");
            } 

            if(error instanceof ZodError) {
                return alert(error.issues[0].message);
            }

            alert("Não foi possível editar o livro!");

        } finally {
            setIsLoading(false);
        }
    }

    return (
        
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
                <Button onClick={onClose} tema="fantasma" tamanho="icon" className="absolute top-4 right-4 font-bold">
                    <Undo2 size={25} />
                </Button>

                <h2 className="text-xl font-bold mb-4">
                    Editar Livro (ID: {idLivro})
                </h2>
                
                {isFetching ? (
                    <p className="text-center text-slate-500 py-8">Carregando dados...</p>
                ) : (
                    <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
                        <Input 
                            legend="Título do Livro" 
                            value={titulo} 
                            onChange={(e) => setTitulo(e.target.value)} 
                        />

                        <Input 
                            legend="Autor" 
                            value={autor} 
                            onChange={(e) => setAutor(e.target.value)} 
                        />
                        
                        <div className="flex gap-4">
                            <div className="w-full">
                                <Input 
                                    legend="Ano de Publicação" 
                                    type="number" 
                                    value={ano_publicacao} 
                                    onChange={(e) => setAno_publicacao(e.target.value)} />
                            </div>

                            <div className="w-full">
                                <Input 
                                    legend="Quantidade" 
                                    type="number" 
                                    value={quantidade_disponivel} 
                                    onChange={(e) => setQuantidade_disponivel(e.target.value)} />
                            </div>
                        </div>

                        <Button type="submit" isLoading={isLoading} className="w-full mt-2">
                            Salvar Alterações
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}