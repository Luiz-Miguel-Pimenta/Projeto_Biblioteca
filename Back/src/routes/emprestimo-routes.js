import { Router } from "express";

import { EmprestimoController } from "../controllers/emprestimos-controller.js";

import { autentificacaoToken } from "../middlewares/autentificacaoToken.js";
import { autorizacaoPerfil } from "../middlewares/autorizacaoPerfil.js";

const emprestimosRoutes = Router();
const emprestimoController = new EmprestimoController()

emprestimosRoutes.post("/criar", autentificacaoToken, autorizacaoPerfil(["leitor"]), emprestimoController.criar);
emprestimosRoutes.get("/emprestimos-leitor", autentificacaoToken, autorizacaoPerfil(["leitor"]), emprestimoController.listarPorLeitor);

emprestimosRoutes.get("/listar", autentificacaoToken, autorizacaoPerfil(["bibliotecario"]), emprestimoController.listar);
emprestimosRoutes.get("/buscar/:id", autentificacaoToken, autorizacaoPerfil(["bibliotecario"]), emprestimoController.listarPorId);
emprestimosRoutes.patch("/:id/devolucao", autentificacaoToken, autorizacaoPerfil(["bibliotecario"]), emprestimoController.registrarDevolucao);
emprestimosRoutes.delete("/deletar/:id", autentificacaoToken, autorizacaoPerfil(["bibliotecario"]), emprestimoController.deletar);

export { emprestimosRoutes }