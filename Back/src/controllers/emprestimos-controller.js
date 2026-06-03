import { database } from "../database/db.js"

class EmprestimoController {
    
    async criar(req, res) {
        const { livro_id, leitor_id, data_devolucao_prevista } = req.body;
        const data_emprestimo = new Date();

        const db = database.promise();

        try {
            const sqlLivro = `SELECT * FROM livro WHERE id = ?`;
            const [livros] = await db.query(sqlLivro, [livro_id]);

            if (livros.length === 0) {
                return res.status(404).json({ message: "Livro não encontrado" });
            }

            const livro = livros[0];

            
            if (livro.quantidade_disponivel <= 0) {
                return res.status(400).json({ message: "Livro indisponível" });
            }

            
            const sqlInsert = `
                INSERT INTO emprestimo (livro_id, leitor_id, data_emprestimo, data_devolucao_prevista, status) 
                VALUES (?, ?, ?, ?, ?)
            `;
            
            const [resultadoEmprestimo] = await db.query(sqlInsert, [
                livro_id, 
                leitor_id, 
                data_emprestimo, 
                data_devolucao_prevista, 
                'ativo'
            ]);

            const sqlAtualizarQuantidade = `
                UPDATE livro SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = ?
            `;
            
            await db.query(sqlAtualizarQuantidade, [livro_id]);

            
            return res.status(201).json({
                message: "Gravado com sucesso!",
                id: resultadoEmprestimo.insertId
            });

        } catch (error) {
            
            console.error("Erro ao criar empréstimo:", error);
            return res.status(500).json({ message: "Erro interno no servidor", error: error.message });
        }
    } 
}

export { EmprestimoController }