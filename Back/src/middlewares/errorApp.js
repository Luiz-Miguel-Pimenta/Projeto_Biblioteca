import { ZodError } from "zod";

function errorApp(error, req, res, next) {
    if (error instanceof ZodError) {
        return res.status(400).json({
            error: "Dados inválidos",
            detalhes: error.issues.map((e) => e.message)

        })
    }

    console.error(error);
    return res.status(500).json({ erro: "Erro do servidor." });
}

export { errorApp }