import { useState } from "react";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";
import { Undo2 } from 'lucide-react';

import { api } from "../services/api"; 

import { Input } from "./Input";     
import { Button } from "./Button";

const livroSchema = z.object({
    titulo: z.string().trim().min(1, { message: "O título é obrigatório" }),
    autor: z.string().trim().min(1, { message: "O autor é obrigatório" }),
    ano_publicacao: z.coerce.number().int().min(1000, { message: "Digite um ano válido" }).max(new Date().getFullYear()),
    quantidade_disponivel: z.coerce.number().int().min(0, { message: "A quantidade não pode ser negativa" }),
});

export function ModalCriarLivro({ onClose, onSuccess }) {
    const [titulo, setTitulo] = useState("");
    const [autor, setAutor] = useState("");
    const [ano_publicacao, setAno_publicacao] = useState("");
    const [quantidade_disponivel, setQuantidade_disponivel] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();

        try {
            setIsLoading(true);
            
            const data = livroSchema.parse({
                titulo, autor, ano_publicacao, quantidade_disponivel
            });

            await api.post("/livro/criar", data);

            alert("Livro cadastrado com sucesso!");
            
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

            alert("Não foi possível cadastrar o livro!");

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
                    Adicionar Novo Livro
                </h2>
                
                <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
                    <Input
                        legend="Título do Livro"
                        placeholder="Ex: Dom Casmurro"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />

                    <Input 
                        legend="Autor"
                        placeholder="Ex: Machado de Assis"
                        value={autor}
                        onChange={(e) => setAutor(e.target.value)}
                    />

                    <div className="flex gap-4">
                        <div className="w-full">
                            <Input 
                                legend="Ano de Publicação"
                                type="number"
                                placeholder="Ex: 1899"
                                value={ano_publicacao}
                                onChange={(e) => setAno_publicacao(e.target.value)}
                            />
                        </div>
                        
                        <div className="w-full">
                            <Input 
                                legend="Quantidade de Livros"
                                type="number"
                                placeholder="Ex: 15"
                                value={quantidade_disponivel}
                                onChange={(e) => setQuantidade_disponivel(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button type="submit" isLoading={isLoading} className="w-full mt-2">
                        Adicionar Livro
                    </Button>
                </form>
            </div>
        </div>
    );
}