import express from "express";
import db from "./database/db.js";

const app = express();

app.use(express.json());

app.get("/teste", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM livro"
    );

    res.status(200).json(rows);
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      erro: "Falha na conexão com o banco de dados",
    });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});