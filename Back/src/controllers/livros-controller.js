import { database } from "../database/db.js";

class LivroController {
  //GET ALL
  async buscarLivros(req, res) {
    database.query("SELECT * FROM livro", (err, result) => {
      try {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }

        if (result.length === 0) {
          return res.status(404).json({ mensagem: "Nenhum livro encontrado!" });
        }

        return res.status(200).json(result);
      } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao buscar livros!" });
      }
    });
  }

  async criarLivro(req, res) {

    console.log(req.body);
    const { titulo, autor, ano_publicacao, quantidade_disponivel } = req.body;

    database.query(
      "INSERT INTO livro (titulo, autor, ano_publicacao, quantidade_disponivel) VALUES (?, ?, ?, ?)",
      [
        titulo,
        autor,
        ano_publicacao,
        quantidade_disponivel,
      ],

      (err, result) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            mensagem: "Erro ao criar livro!",
          });
        }
        return res.status(201).json({
          mensagem: "Livro criado com sucesso!",
          id: result.insertId,
        });
      },
    );
  }
}

export { LivroController };
