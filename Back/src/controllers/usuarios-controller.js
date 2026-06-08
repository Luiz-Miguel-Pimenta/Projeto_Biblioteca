import { z } from "zod"
import jwt from "jsonwebtoken"

import { AppError } from "../utils/AppError.js";
import { database } from "../database/db.js"

class UsuarioController {
    
    async cadastro(req, res, next) {

        try {
            const cadastroSchema = z.object({
                nome: z.string().trim().min(2, { message: "O nome é obrigatório." }),
                email: z.string().email({ message: "E-mail inválido." }),
                senha: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
                perfil: z.enum(["bibliotecario", "leitor"], { message: "O perfil deve ser 'bibliotecario' ou 'leitor'." }),
            });

            const { nome, email, senha, perfil } = cadastroSchema.parse(req.body);

            const [usuarioComEmailIgual] = await database.promise().query("SELECT * FROM usuario WHERE email = ?", [email]);

            if(usuarioComEmailIgual.length > 0) {
                throw new AppError("Usuário já existe com esse email", 409)
            }

            // [linhasEncontradas, metadados]
            const [result] = await database.promise().query("INSERT INTO usuario (nome, email, senha, perfil) VALUES (?, ?, ?, ?)", [nome, email, senha, perfil])

            return res.status(201).json({ id:result.insertId, nome, email, perfil }); 

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async login(req, res, next) {

        try {
            const loginSchema = z.object({
                email: z.string().email({ message: "E-mail inválido." }),
                senha: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
            })

            const { email, senha } = loginSchema.parse(req.body);

            // [linhasEncontradas, metadados]
            const [result] = await database.promise().query("SELECT * FROM usuario WHERE email = ? AND senha = ?", [email, senha])

            if(result.length === 0) {
                throw new AppError("E-mail ou senha inválidos!", 401)
            }

            const token = jwt.sign(
                { perfil: result[0].perfil },
                process.env.JWT_SECRET,
                {
                    subject: String(result[0].id),
                    expiresIn: "1d",
                }
            )

            return res.status(200).json({ 
                mensagem: "Login realizado com sucesso!",
                token,
                usuario: {
                    nome: result[0].nome,
                    email: result[0].email, 
                }
            })

        } catch (error) {
            console.log(error);
            next(error);
        }
    }  
}

export { UsuarioController }