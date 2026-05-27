import { Router } from "express";

import { EmprestimoController } from "../controllers/emprestimos-controller.js";

const emprestimosRoutes = Router();
const emprestimoController = new EmprestimoController()

emprestimosRoutes.use("/criar", emprestimoController.criar)

export { emprestimosRoutes }