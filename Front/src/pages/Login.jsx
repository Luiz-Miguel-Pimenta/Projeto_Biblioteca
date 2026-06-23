import { useActionState } from "react";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";

import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth"

import { Input } from "../components/Input";
import { Button } from "../components/Button";

const loginSchema = z.object({
    email: z.string().email({ message: "E-mail inválido" }),
    senha: z.string().min(6, { message: "Informe a senha" }),
});

export function Login() {
    const [state, formAction, isLoading] = useActionState(fazerLogin, null);

    const navigate = useNavigate();
    const auth = useAuth();

    async function fazerLogin(_, formData) {
        try {
            const data = loginSchema.parse({
                email: formData.get("email"),
                senha: formData.get("senha")
            })

            const response = await api.post("/usuario/login", data);
            auth.login(response.data)

        } catch (error) {
            console.log(error);

            if(error instanceof ZodError) {
                return { message: error.issues[0].message };
            };

            if(error instanceof AxiosError) {
                return { message: error.response?.data.message || "Erro no servidor" };
            }

            return { message: "Não foi possível entrar"};
        }
    }

    return (
        <div className="w-full flex flex-col">
            <form action={formAction} className="w-full flex flex-col gap-4">
                <Input 
                    legend="E-mail"
                    type="email"
                    required
                    name="email"
                    placeholder="seu@email.com"
                />
            
                <Input 
                    legend="Senha"
                    type="password"
                    required
                    name="senha"
                    placeholder="******"
                />
                {state?.message && !isLoading && (
                    <p className="text-sm text-red-600 text-center my-2 font-medium">
                        {state.message}
                    </p>
                )}

                <Button type="submit" tema="principal" isLoading={isLoading} className="w-full">
                    Entrar
                </Button>
            </form>

            <Button
                onClick={() => navigate("/cadastrar")}
                tema="fantasma"
                tamanho="link"
                className="font-semibold mt-5"
            >
                Criar uma conta
            </Button>
        </div>
    )
}