import { useActionState } from "react";

import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function onSubmit() {

    }

    return (
        <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
            <Input 
                legend="E-mail"
                type="email"
                placeholder="seu@email.com"
                required
            />
        
            <Input 
                legend="Senha"
                type="password"
                placeholder="******"
                required
            />
        </form>
    )
}