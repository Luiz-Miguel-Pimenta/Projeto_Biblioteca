import { Router } from "express";

import { emprestimosRoutes } from "./emprestimo-routes.js";
import { usuariosRoutes } from "./usuario-routes.js";
import { livrosRoutes } from "./livros-routes.js";

const rotasApp = Router();

rotasApp.use("/emprestimo", emprestimosRoutes);
rotasApp.use("/usuario", usuariosRoutes);
rotasApp.use("/livro", livrosRoutes);

export { rotasApp }