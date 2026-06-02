import { Router } from "express";

import { UsuarioController } from "../controllers/usuarios-controller.js";

const usuariosRoutes = Router();
const usuarioController = new UsuarioController();

usuariosRoutes.post("/login", usuarioController.login)
usuariosRoutes.post("/cadastro", usuarioController.cadastro)


export { usuariosRoutes }