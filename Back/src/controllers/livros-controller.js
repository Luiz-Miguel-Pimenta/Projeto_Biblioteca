import { z } from "zod";

import { database } from "../database/db.js";
import { AppError } from "../utils/AppError.js";

const livroSchema = z.object({
  titulo: z.string().trim().min(1, { message: "O título é obrigatório." }),
  autor: z.string().trim().min(1, { message: "O autor é obrigatório." }),
  ano_publicacao: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear()),
  quantidade_disponivel: z
    .number()
    .int()
    .min(0, { message: "A quantidade disponível não pode ser negativa." }),
});

class LivroController {
  // GET ALL
  async buscarLivros(req, res, next) {

    try {
      const [result] = await database.promise().query("SELECT * FROM livro");

      if (result.length === 0) {
        throw new AppError("Nenhum livro encontrado", 404);
      }

      return res.status(200).json(result);

    } catch (error) {
      console.log(error);
      next(error)
    }
  }

  // GET BY ID
  async buscarLivrosPorID(req, res, next) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        throw new AppError("ID inválido!", 400);
      }

      const [result] = await database.promise().query("SELECT * FROM livro WHERE id = ?", [id]);

      if (result.length === 0) {
        throw new AppError("Nenhum livro encontrado", 404);
      }

      return res.status(200).json(result[0]);

    } catch (error) {
      console.log(error);
      next(error)
    }
  }

  // POST
  async criarLivro(req, res, next) {
    try {
      const { titulo, autor, ano_publicacao, quantidade_disponivel } = livroSchema.parse(req.body);

      const [livroExistente] = await database
        .promise()
        .query("SELECT * FROM livro WHERE titulo = ? AND autor = ?", [
          titulo,
          autor,
        ]);

      if (livroExistente.length > 0) {
        throw new AppError("Livro já cadastrado!", 409);
      }

      const [result] = await database.promise().query(
        `INSERT INTO livro
        (titulo, autor, ano_publicacao, quantidade_disponivel)
        VALUES (?, ?, ?, ?)`,
        [titulo, autor, ano_publicacao, quantidade_disponivel],
      );

      return res.status(201).json({
        mensagem: "Livro criado com sucesso!",
        id: result.insertId,
      });

    } catch (error) {
      console.log(error);
      next(error)
    }
  }

  // PUT
  async atualizarLivro(req, res, next) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        throw new AppError("ID inválido!", 400);
      }

      const { titulo, autor, ano_publicacao, quantidade_disponivel } =
        livroSchema.parse(req.body);

      const [result] = await database.promise().query(
        `UPDATE livro
         SET titulo = ?, autor = ?, ano_publicacao = ?, quantidade_disponivel = ?
         WHERE id = ?`,
        [titulo, autor, ano_publicacao, quantidade_disponivel, id],
      );

      if (result.affectedRows === 0) {
        throw new AppError("Livro não encontrado!", 404);
      };

      return res.status(200).json({
        mensagem: "Livro atualizado com sucesso!",
      });

    } catch (error) {
      console.log(error);
      next(error)
    }
  }

  // DELETE
  async excluirLivro(req, res, next) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        throw new AppError("ID inválido!", 400);
      }

      const [result] = await database
        .promise()
        .query("DELETE FROM livro WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        throw new AppError("Livro não encontrado!", 404);
      }

      return res.status(200).json({
        mensagem: "Livro excluído com sucesso!",
      });

    } catch (error) {
      console.log(error);
      next(error)
    }
  }
}

export { LivroController };
