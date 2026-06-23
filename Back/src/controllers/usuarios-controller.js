import { z } from "zod"
import jwt from "jsonwebtoken"
import { compare, hash } from "bcryptjs";

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

            const senhaHashed = await hash(senha, 8);

            const [result] = await database.promise().query(
                "INSERT INTO usuario (nome, email, senha, perfil) VALUES (?, ?, ?, ?)", 
                [nome, email, senhaHashed, perfil]
            )

            return res.status(201).json({ 
                message: "Usuário cadastrodo com Sucesso",
            }); 

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

            const [usuario] = await database.promise().query("SELECT * FROM usuario WHERE email = ?", [email])

            if(usuario.length === 0) {
                throw new AppError("E-mail ou senha inválidos!", 401)
            }

            const senhasIguais = await compare(senha, usuario[0].senha);

            if(!senhasIguais) {
                throw new AppError("E-mail ou senha inválidos!", 401)
            }

            const token = jwt.sign(
                { perfil: usuario[0].perfil },
                process.env.JWT_SECRET,
                {
                    subject: String(usuario[0].id),
                    expiresIn: "1d",
                }
            )

            const { senha: _, ...usuarioLogado } = usuario[0];

            return res.status(200).json({ 
                mensagem: "Login realizado com sucesso!",
                token,
                usuario: usuarioLogado
            })

        } catch (error) {
            console.log(error);
            next(error);
        }
    }  
}

export { UsuarioController }