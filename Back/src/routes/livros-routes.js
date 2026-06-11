import { Router } from "express";

import { LivroController } from "../controllers/livros-controller.js";

import { autentificacaoToken } from "../middlewares/autentificacaoToken.js";
import { autorizacaoPerfil } from "../middlewares/autorizacaoPerfil.js";

const livrosRoutes = Router();
const livroController = new LivroController();

livrosRoutes.get("/listar", autentificacaoToken, livroController.buscarLivros);
livrosRoutes.get("/buscar/:id", autentificacaoToken, livroController.buscarLivrosPorID);

livrosRoutes.post("/criar", autentificacaoToken, autorizacaoPerfil(["bibliotecario"]), livroController.criarLivro);
livrosRoutes.put("/atualizar/:id", autentificacaoToken, autorizacaoPerfil(["bibliotecario"]), livroController.atualizarLivro);
livrosRoutes.delete("/deletar/:id", autentificacaoToken, autorizacaoPerfil(["bibliotecario"]), livroController.excluirLivro);

export { livrosRoutes };