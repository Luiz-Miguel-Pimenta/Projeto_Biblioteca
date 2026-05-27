import { Router } from "express";

import { LivroController } from "../controllers/livros-controller.js";

const livrosRoutes = Router();
const livroController = new LivroController();

livrosRoutes.use("/criar", livroController.criar)

export { livrosRoutes }