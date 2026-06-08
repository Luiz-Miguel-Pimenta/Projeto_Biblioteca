function autorizacaoPerfil(perfisAutorizados) {

    return (req, res, next) => {
        if(!req.usuario) {
            return res.status(401).json({ erro: "Usuário não autentificado." });
        };

        if(!perfisAutorizados.includes(req.usuario.perfil)) {
            return res.status(403).json({ erro: "Acesso negado." });
        }

        return next();
    }
}

export { autorizacaoPerfil }