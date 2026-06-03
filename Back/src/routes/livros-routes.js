import { Router } from "express";

import { LivroController } from "../controllers/livros-controller.js";

const livrosRoutes = Router();
const livroController = new LivroController();

livrosRoutes.get("/livros", livroController.buscarLivros);
livrosRoutes.post("/livros", livroController.criarLivro);
livrosRoutes.get("/livros/:id", livroController.buscarLivrosPorID);
livrosRoutes.put("/livros/:id", livroController.atualizarLivro);
livrosRoutes.delete("/livros/:id", livroController.excluirLivro);


export { livrosRoutes };