import { useState } from "react";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";
import { api } from "../services/api"; 

import { Input } from "./Input";     
import { Button } from "./Button";


const livroSchema = z.object({
    titulo: z.string().trim().min(1, { message: "O título é obrigatório" }),
    autor: z.string().trim().min(1, { message: "O autor é obrigatório" }),
    ano: z.coerce.number().min(1000, { message: "Digite um ano válido" }),
    quantidade: z.coerce.number().min(1, { message: "A quantidade inicial deve ser no mínimo 1" }),
});

export function FormularioLivro() {
    const [titulo, setTitulo] = useState("");
    const [autor, setAutor] = useState("");
    const [ano, setAno] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();

        try {
            setIsLoading(true);

            
            const data = livroSchema.parse({
                titulo, autor, ano, quantidade
            });

            
            await api.post("/livro/criar", {
            titulo: data.titulo,
            autor: data.autor,
            ano_publicacao: data.ano,
            quantidade_disponivel: data.quantidade
        });
            alert("Livro cadastrado com sucesso!");
            
           
            setTitulo("");
            setAutor("");
            setAno("");
            setQuantidade("");

        } catch (error) {
            console.log(error);

            if(error instanceof AxiosError) {
                return alert(error.response?.data.message || "Erro de Servidor: Tente mais tarde");
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
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Adicionar Novo Livro</h2>
            
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
                            value={ano}
                            onChange={(e) => setAno(e.target.value)}
                        />
                    </div>
                    
                    <div className="w-full">
                        <Input 
                            legend="Quantidade Inicial"
                            type="number"
                            placeholder="Ex: 15"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                        />
                    </div>
                </div>

                <Button type="submit" isLoading={isLoading}>
                    Salvar Livro
                </Button>
            </form>
        </div>
    );
}