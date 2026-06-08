import { Router } from "express";

import { LivroController } from "../controllers/livros-controller.js";

import { autentificacaoToken } from "../middlewares/autentificacaoToken.js";
import { autorizacaoPerfil } from "../middlewares/autorizacaoPerfil.js";

const livrosRoutes = Router();
const livroController = new LivroController();

livrosRoutes.get("/livros", autentificacaoToken, livroController.buscarLivros);
livrosRoutes.get("/livros/:id", autentificacaoToken, livroController.buscarLivrosPorID);

livrosRoutes.post("/livros", autentificacaoToken, autorizacaoPerfil(["bibliotecario"]), livroController.criarLivro);
livrosRoutes.put("/livros/:id", autentificacaoToken, autorizacaoPerfil(["bibliotecario"]), livroController.atualizarLivro);
livrosRoutes.delete("/livros/:id", autentificacaoToken, autorizacaoPerfil(["bibliotecario"]), livroController.excluirLivro);

export { livrosRoutes };