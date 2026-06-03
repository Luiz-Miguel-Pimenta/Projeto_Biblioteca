import { database } from "../database/db.js";
import { z, ZodError } from "zod";

const livroSchema = z.object({
  titulo: z.string().trim().min(1, { message: "O título é obrigatório." }),

  autor: z.string().trim().min(1, { message: "O autor é obrigatório." }),

  ano_publicacao: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear())
    .optional(),

  quantidade_disponivel: z
    .number()
    .int()
    .min(0, { message: "A quantidade disponível não pode ser negativa." }),
});

class LivroController {
  // GET ALL
  async buscarLivros(req, res) {
    try {
      const [result] = await database.promise().query("SELECT * FROM livro");

      if (result.length === 0) {
        return res.status(404).json({
          mensagem: "Nenhum livro encontrado!",
        });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensagem: "Erro ao buscar livros!",
      });
    }
  }

  // GET BY ID
  async buscarLivrosPorID(req, res) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        return res.status(400).json({
          mensagem: "ID inválido!",
        });
      }

      const [result] = await database
        .promise()
        .query("SELECT * FROM livro WHERE id = ?", [id]);

      if (result.length === 0) {
        return res.status(404).json({
          mensagem: "Livro não encontrado!",
        });
      }

      return res.status(200).json(result[0]);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensagem: "Erro ao buscar livro!",
      });
    }
  }

  // POST
  async criarLivro(req, res) {
    try {
      const { titulo, autor, ano_publicacao, quantidade_disponivel } =
        livroSchema.parse(req.body);

      const [livroExistente] = await database
        .promise()
        .query("SELECT * FROM livro WHERE titulo = ? AND autor = ?", [
          titulo,
          autor,
        ]);

      if (livroExistente.length > 0) {
        return res.status(409).json({
          mensagem: "Livro já cadastrado!",
        });
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
      if (error instanceof ZodError) {
        return res.status(400).json({
          mensagem: error.issues[0].message,
        });
      }

      console.error(error);

      return res.status(500).json({
        mensagem: "Erro ao criar livro!",
      });
    }
  }

  // PUT
  async atualizarLivro(req, res) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        return res.status(400).json({
          mensagem: "ID inválido!",
        });
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
        return res.status(404).json({
          mensagem: "Livro não encontrado!",
        });
      }

      return res.status(200).json({
        mensagem: "Livro atualizado com sucesso!",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          mensagem: error.issues[0].message,
        });
      }

      console.error(error);

      return res.status(500).json({
        mensagem: "Erro ao atualizar livro!",
      });
    }
  }

  // DELETE
  async excluirLivro(req, res) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        return res.status(400).json({
          mensagem: "ID inválido!",
        });
      }

      const [result] = await database
        .promise()
        .query("DELETE FROM livro WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          mensagem: "Livro não encontrado!",
        });
      }

      return res.status(200).json({
        mensagem: "Livro excluído com sucesso!",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensagem: "Erro ao excluir livro!",
      });
    }
  }
}

export { LivroController };
