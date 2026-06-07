import { Router } from "express";

import { EmprestimoController } from "../controllers/emprestimos-controller.js";

const emprestimosRoutes = Router();
const emprestimoController = new EmprestimoController()

// Criar empréstimo (Leitor)
emprestimosRoutes.post("/criar", emprestimoController.criar);

// Listar empréstimos do leitor
emprestimosRoutes.get("/leitor/:leitor_id", emprestimoController.listarPorLeitor);

// Listar todos os empréstimos (Bibliotecário)
emprestimosRoutes.get("/", emprestimoController.listar);

// Buscar empréstimo por ID (Bibliotecário)
emprestimosRoutes.get("/:id", emprestimoController.listarPorId);

// Registrar devolução (Bibliotecário)
emprestimosRoutes.put("/:id/devolucao", emprestimoController.registrarDevolucao);

// Cancelar empréstimo (Bibliotecário)
emprestimosRoutes.delete("/:id", emprestimoController.deletar);

export { emprestimosRoutes }