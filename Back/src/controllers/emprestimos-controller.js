import { database } from "../database/db.js"

class EmprestimoController {

    // POST - Criar empréstimo (apenas leitor)
    async criar(req, res) {
        const { livro_id, leitor_id, data_devolucao_prevista } = req.body;
        const data_emprestimo = new Date();
        const db = database.promise();

        try {
            const [usuarios] = await db.query(`SELECT * FROM usuario WHERE id = ?`, [leitor_id]);

            if (usuarios.length === 0) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            if (usuarios[0].perfil !== 'leitor') {
                return res.status(403).json({ message: "Apenas leitores podem solicitar empréstimos" });
            }

            const [livros] = await db.query(`SELECT * FROM livro WHERE id = ?`, [livro_id]);

            if (livros.length === 0) {
                return res.status(404).json({ message: "Livro não encontrado" });
            }

            if (livros[0].quantidade_disponivel <= 0) {
                return res.status(400).json({ message: "Livro indisponível" });
            }

            

            const [resultado] = await db.query(`
                INSERT INTO emprestimo (livro_id, leitor_id, data_emprestimo, data_devolucao_prevista, status) VALUES (?, ?, ?, ?, ?)`, [
                livro_id,
                leitor_id,
                data_emprestimo,
                data_devolucao_prevista,
                'ativo'
            ]);

            
            await db.query(`UPDATE livro SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = ?`, [livro_id]);

            return res.status(201).json({
                message: "Empréstimo criado com sucesso!",
                id: resultado.insertId
            });

        } catch (error) {
            console.error("Erro ao criar empréstimo:", error);
            return res.status(500).json({ message: "Erro interno no servidor", error: error.message });
        }
    }

    // GET ALL - apenas bibliotecário
    async listar(req, res) {
        const db = database.promise();

        try {
            await db.query(`
                UPDATE emprestimo 
                SET status = 'atrasado' 
                WHERE status = 'ativo' 
                AND data_devolucao_prevista < CURDATE()
                AND data_devolucao_real IS NULL
            `);

            
            const [result] = await db.query(`SELECT * FROM emprestimo`);

            if (result.length === 0) {
                return res.status(404).json({ message: "Nenhum empréstimo encontrado" });
            }

            return res.status(200).json(result);

        } catch (error) {
            console.error("Erro ao listar empréstimos:", error);
            return res.status(500).json({ message: "Erro interno no servidor", error: error.message });
        }
    }

    // GET ID - apenas bibliotecário
    async listarPorId(req, res) {
        const db = database.promise();

        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({ message: "ID inválido!" });
            }

            
            const [result] = await db.query(`SELECT * FROM emprestimo WHERE id = ?`, [id]);

            if (result.length === 0) {
                return res.status(404).json({ message: "Empréstimo não encontrado" });
            }

            return res.status(200).json(result[0]);

        } catch (error) {
            console.error("Erro ao listar empréstimo:", error);
            return res.status(500).json({ message: "Erro interno no servidor", error: error.message });
        }
    }

    // GET por leitor - apenas leitor
    async listarPorLeitor(req, res) {
        const db = database.promise();

        try {
            const { leitor_id } = req.params;

            if (isNaN(leitor_id)) {
                return res.status(400).json({ message: "ID de leitor inválido!" });
            }

            await db.query(`
                UPDATE emprestimo 
                SET status = 'atrasado' 
                WHERE status = 'ativo' 
                AND data_devolucao_prevista < CURDATE()
                AND data_devolucao_real IS NULL
            `);

            
            const [result] = await db.query(`SELECT * FROM emprestimo WHERE leitor_id = ? AND status IN ('ativo', 'atrasado')`, [leitor_id]);

            if (result.length === 0) {
                return res.status(404).json({ message: "Nenhum empréstimo ativo encontrado para este leitor" });
            }

            return res.status(200).json(result);

        } catch (error) {
            console.error("Erro ao listar empréstimos do leitor:", error);
            return res.status(500).json({ message: "Erro interno no servidor", error: error.message });
        }
    }

    // PUT - apenas bibliotecário
    async registrarDevolucao(req, res) {
        const db = database.promise();

        try {
            const { id } = req.params;
            const { bibliotecario_id } = req.body;
            const data_devolucao_real = new Date();

            
            const [usuarios] = await db.query(`SELECT * FROM usuario WHERE id = ?`, [bibliotecario_id]);

            if (usuarios.length === 0) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            if (usuarios[0].perfil !== 'bibliotecario') {
                return res.status(403).json({ message: "Apenas bibliotecários podem aprovar devoluções" });
            }

            
            const [emprestimos] = await db.query(`SELECT * FROM emprestimo WHERE id = ?`, [id]);

            if (emprestimos.length === 0) {
                return res.status(404).json({ message: "Empréstimo não encontrado" });
            }

            const emprestimo = emprestimos[0];

            if (emprestimo.status === 'devolvido') {
                return res.status(400).json({ message: "Este empréstimo já foi devolvido" });
            }

            
            await db.query(`UPDATE emprestimo SET data_devolucao_real = ?, status = ? WHERE id = ?`, [data_devolucao_real, 'devolvido', id]);

            await db.query(`UPDATE livro SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = ?`, [emprestimo.livro_id]);

            return res.status(200).json({ message: "Devolução registrada com sucesso!" });

        } catch (error) {
            console.error("Erro ao registrar devolução:", error);
            return res.status(500).json({ message: "Erro interno no servidor", error: error.message });
        }
    }

    // DELETE - apenas bibliotecário
    async deletar(req, res) {
        const db = database.promise();

        try {
            const { id } = req.params;
            const { bibliotecario_id } = req.body;

            if (isNaN(id)) {
                return res.status(400).json({ message: "ID inválido!" });
            }

            
            const [usuarios] = await db.query(`SELECT * FROM usuario WHERE id = ?`, [bibliotecario_id]);

            if (usuarios.length === 0) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            if (usuarios[0].perfil !== 'bibliotecario') {
                return res.status(403).json({ message: "Apenas bibliotecários podem cancelar empréstimos" });
            }

            
            const [emprestimos] = await db.query(`SELECT * FROM emprestimo WHERE id = ?`, [id]);

            if (emprestimos.length === 0) {
                return res.status(404).json({ message: "Empréstimo não encontrado" });
            }

            const emprestimo = emprestimos[0];

            if (emprestimo.status === 'ativo' || emprestimo.status === 'atrasado') {
                await db.query(`UPDATE livro SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = ?`, [emprestimo.livro_id]);
            }

            await db.query(`DELETE FROM emprestimo WHERE id = ?`, [id]);

            return res.status(200).json({ message: "Empréstimo cancelado com sucesso!" });

        } catch (error) {
            console.error("Erro ao deletar empréstimo:", error);
            return res.status(500).json({ message: "Erro interno no servidor", error: error.message });
        }
    }
}

export { EmprestimoController }