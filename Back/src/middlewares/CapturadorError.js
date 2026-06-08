import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

function capturadorError(error, req, res, next) {
    if (error instanceof AppError) {
        return res.status(error.statusErro).json({ message: error.messagem });
    }

    if (error instanceof ZodError) {
        return res.status(400).json({
            error: "Dados inválidos",
            detalhes: error.issues.map((e) => e.message)
        })
    }

    console.error(error);
    return res.status(500).json({ message: error.message });
}

export { capturadorError }