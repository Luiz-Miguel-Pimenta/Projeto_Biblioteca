import { Router } from "express";

import { UsuarioController } from "../controllers/usuarios-controller.js";

const usuariosRoutes = Router();
const usuarioController = new UsuarioController();

usuariosRoutes.use("/criar", usuarioController.criar)


export { usuariosRoutes }