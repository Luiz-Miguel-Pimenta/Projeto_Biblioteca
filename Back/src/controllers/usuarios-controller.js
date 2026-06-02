import { database } from "../database/db.js"
import { z } from "zod"

class UsuarioController {
    cadastro(req, res) {
        const cadastroSchema = z.object({
            nome: z.string().trim().min(2, { message: "O nome é obrigatório." }),
            email: z.string().email({ message: "E-mail inválido." }),
            senha: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
            perfil: z.enum(["bibliotecario", "leitor"], { message: "O perfil deve ser 'bibliotecario' ou 'leitor'." }),
        });

        const { nome, email, senha, perfil } = cadastroSchema.parse(req.body);

        database.query("INSERT INTO usuario (nome, email, senha, perfil) VALUES (?, ?, ?, ?)", [nome, email, senha, perfil],
            (error, result) => {
                if(error) {
                    console.log(error)
                    return res.status(500).send(error);
                }
                res.status(201).json({ id:result.insertId, nome, email, perfil });
            }
        )
    }

    async login(req, res) {
        const loginSchema = z.object({
            email: z.string().email({ message: "E-mail inválido." }),
            senha: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
        })

        const { email, senha } = loginSchema.parse(req.body);

        database.query("SELECT * FROM usuario WHERE email = ? AND senha = ?", [email, senha],
            (error, result) => {
                if(error) {
                    console.log(error)
                    return res.status(500).send(error);
                }

                if(result.length === 0) {
                    return res.status(401).json({ erro: "E-mail ou senha inválidos!" })
                }

                res.status(200).json({ 
                    mensagem: "Login realizado com sucesso!",
                    usuario: {
                        id: result[0].id, 
                        nome: result[0].nome, 
                        perfil: result[0].perfil 
                    }
                })
            }
        );
        
    }
}

export { UsuarioController }