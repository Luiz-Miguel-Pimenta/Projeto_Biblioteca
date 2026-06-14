import { useState } from "react"
import { email, z, ZodError } from "zod";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";

import { api } from "../services/api";

import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Select } from "../components/Select";


const cadastrarSchema = z.object({
    nome: z.string().trim().min(2, { message: "Nome é obrigatório" }),
    email: z.string().email({ message: "E-mail é obrigatório" }),
    senha: z.string().min(6, { message: "Senha deve ter pelo menos 6 dígitos" }),
    senhaConfirmacao: z.string({ message: "Confirme a senha" }),
    perfil: z.enum(["bibliotecario", "leitor"], { message: "O perfil deve ser 'bibliotecario' ou 'leitor'." }),
}).refine((data) => data.senha === data.senhaConfirmacao, {
    message: "As senhas não são iguais!",
})

export function Cadastrar() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [senhaConfirmacao, setSenhaConfirmacao] = useState("");
    const [perfil, setPerfil] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    async function onSubmit(e) {
        e.preventDefault();

        try {
            setIsLoading(true);

            const data = cadastrarSchema.parse({
                nome, email, senha, senhaConfirmacao, perfil
            })

            await api.post("/usuario/cadastro", {
                nome: data.nome,
                email: data.email,
                senha: data.senha, 
                perfil: data.perfil,
            })

            if(confirm("Cadastrado com sucesso.")) {
                navigate("/");
            };


        } catch (error) {
            console.log(error);

            if(error instanceof AxiosError) {
                return alert(error.response?.data.message || "Erro de Server: Tente mais tarde");
            }

            if(error instanceof ZodError) {
                return alert(error.issues[0].message)
            }

            alert("Não foi possível cadastrar!");
        } finally {
            setIsLoading(false)
        }
    }

    return (
    
        <div>
            <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
                <Input
                    legend="Nome"
                    placeholder="Seu nome"
                    required
                    onChange={(e) => setNome(e.target.value)}
                />

                <Input 
                    legend="E-mail"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input 
                    legend="Senha"
                    type="password"
                    placeholder="******"
                    required
                    onChange={(e) => setSenha(e.target.value)}
                />

                <Input 
                    legend="Confirme sua senha"
                    type="password"
                    placeholder="******"
                    required
                    onChange={(e) => setSenhaConfirmacao(e.target.value)}
                />

                <Select
                    legend="Seleciona seu perfil"
                    required
                    onChange={(e) => setPerfil(e.target.value)}
                >
                    <option value="leitor">Leitor</option>
                    <option value="bibliotecario">Bibliotecário</option>
                </Select>

                <Button type="submit" isLoading={isLoading}>
                    Cadastrar
                </Button>

                <button
                    onClick={() => navigate("/")}
                    className="text-sm font-semibold text-slate-500 
                    mt-2 text-center hover:text-blue-600 cursor-pointer"
                >
                    Já tenho uma conta
                </button>
            </form>
        </div>
    )
}