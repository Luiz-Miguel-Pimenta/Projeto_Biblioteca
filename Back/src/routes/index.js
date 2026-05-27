import { Router } from "express";

import { emprestimosRoutes } from "./emprestimo-routes.js";
import { usuariosRoutes } from "./usuario-routes.js";
import { livrosRoutes } from "./livros-routes.js";

const routes = Router();

routes.use("/emprestimo", emprestimosRoutes);
routes.use("/usuario", usuariosRoutes);
routes.use("/livro", livrosRoutes);

export { routes }