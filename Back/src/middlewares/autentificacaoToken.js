import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

function autentificacaoToken (req, res, next) {

    try {
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return next(new AppError("Acesso negado. Token não fornecido.", 401));
        }

        const [, token] = authHeader.split(" ");

        const { perfil, sub: usuario_id } = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = {
            id: usuario_id,
            perfil,
        }

        return next();

    } catch (error) {
        return next(new AppError("Token inválido ou expirado.", 403));
    }
}

export { autentificacaoToken }