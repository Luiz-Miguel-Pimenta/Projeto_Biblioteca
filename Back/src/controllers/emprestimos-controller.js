import { z } from "zod";

import { database } from "../database/db.js"
import { AppError } from "../utils/AppError.js";

class EmprestimoController {

    async criar(req, res, next) {
        try {
            const emprestimoSchema = z.object({
                livro_id: z.number().int().positive({ message: "ID do livro inválido." }),
            })

            const { livro_id } = emprestimoSchema.parse(req.body);
            const leitor_id = req.usuario.id;

            const data_emprestimo = new Date();
            const data_devolucao_prevista = new Date(data_emprestimo);
            data_devolucao_prevista.setDate(data_devolucao_prevista.getDate() + 30);

            const [livros] = await database.promise().query(`SELECT * FROM livro WHERE id = ?`, [livro_id]);

            if (livros.length === 0) {
                throw new AppError("Livro não encontrado", 404);
            }

            if (livros[0].quantidade_disponivel <= 0) {
                throw new AppError("Livro indisponível. Sem estoque.", 400);
            }

            const [result] = await database.promise().query(`
                INSERT INTO emprestimo (livro_id, leitor_id, data_emprestimo, data_devolucao_prevista, status) VALUES (?, ?, ?, ?, ?)`, [
                livro_id,
                leitor_id,
                data_emprestimo,
                data_devolucao_prevista,
                'ativo'
            ]);

            
            await database.promise().query(`UPDATE livro SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = ?`, [livro_id]);

            return res.status(201).json({
                message: "Empréstimo criado com sucesso!",
                id: result.insertId,
                livro_id, 
                leitor_id, 
                data_emprestimo,
                data_devolucao_prevista
            });

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async listar(req, res, next) {
        try {
            await database.promise().query(`
                UPDATE emprestimo 
                SET status = 'atrasado' 
                WHERE status = 'ativo' 
                AND data_devolucao_prevista < CURDATE()
                AND data_devolucao_real IS NULL
            `);

            const [result] = await database.promise().query(`
                    SELECT 
                        e.id,
                        e.data_emprestimo,
                        e.data_devolucao_prevista,
                        e.data_devolucao_real,
                        e.status,
                        e.livro_id,
                        l.titulo AS livro_titulo,
                        e.leitor_id,
                        u.nome AS leitor_nome
                    FROM emprestimo e
                    INNER JOIN livro l ON e.livro_id = l.id
                    INNER JOIN usuario u ON e.leitor_id = u.id
                    ORDER BY e.id DESC
                `);

            if (result.length === 0) {
                throw new AppError("Nenhum empréstimo encontrado", 404);
            }

            return res.status(200).json(result);

        } catch (error) {
            console.error("Erro ao listar empréstimos:", error);
            next(error)
        }
    }

    async listarPorLeitor(req, res, next) {
        try {
            const leitor_id = req.usuario.id;

            await database.promise().query(`
                UPDATE emprestimo 
                SET status = 'atrasado' 
                WHERE status = 'ativo' 
                AND data_devolucao_prevista < CURDATE()
                AND data_devolucao_real IS NULL
            `);

            const [result] = await database.promise().query(`
                SELECT 
                    e.id,
                    e.data_emprestimo,
                    e.data_devolucao_prevista,
                    e.status,
                    e.livro_id,
                    l.titulo AS livro_titulo,
                    u.nome AS leitor_nome
                FROM emprestimo e
                INNER JOIN livro l ON e.livro_id = l.id
                INNER JOIN usuario u ON e.leitor_id = u.id
                WHERE e.leitor_id = ?
                ORDER BY e.id ASC
            `, [leitor_id]);

            if (result.length === 0) {
                throw new AppError("Nenhum empréstimo feito até o momento", 404);
            }

            return res.status(200).json(result);

        } catch (error) {
            console.error("Erro ao listar empréstimos do leitor:", error);
            next(error)
        }
    }

    async solicitarDevolucao(req, res, next){
        try {
            const { id } = req.params;

            if(isNaN(id)){
                throw new AppError("ID invalido",400);
            }

            const [emprestimo] = await database.promise().query(`SELECT * FROM  emprestimo WHERE id = ?`,[id]);

            if (emprestimo.length === 0) {
                throw new AppError("Empréstimo não encontrado", 404);
            }

            if(emprestimo[0].status === 'devolvido'){
                throw new AppError("Este emprestimo já foi devolvido",400);
            }

            if(emprestimo[0].status === 'pendente'){
                throw new AppError("A devolução deste emprestimo já foi solicitada",400);
            }

            await database.promise().query(`UPDATE emprestimo SET status = 'pendente' WHERE id = ?`,[id]);

            return res.status(200).json({ message: "Devolução solicitada! Aguarde a aprovção do bibliotecario" });

        } catch (error) {
            console.error("Erro ao solicitar devolução:", error);
            next(error)
        }
    }
    
    async registrarDevolucao(req, res, next) {
        try {
            const { id } = req.params;
            const data_devolucao_real = new Date();

            const [emprestimo] = await database.promise().query(`SELECT * FROM emprestimo WHERE id = ?`, [id]);

            if (emprestimo.length === 0) {
                throw new AppError("Empréstimo não encontrado", 404);
            }

            if (emprestimo[0].status !== 'pendente') {
                throw new AppError("O leitor não resgistrou a devolução deste empréstimo.", 400);
            }
            
            await database.promise().query(`UPDATE emprestimo SET data_devolucao_real = ?, status = ? WHERE id = ?`, [data_devolucao_real, 'devolvido', id]);

            await database.promise().query(`UPDATE livro SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = ?`, [emprestimo[0].livro_id]);

            return res.status(200).json({ message: "Devolução registrada com sucesso!" });

        } catch (error) {
            console.error("Erro ao registrar devolução:", error);
            next(error)
        }
    }

    async deletar(req, res, next) {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                throw new AppError("ID inválido!", 400);
            }
  
            const [emprestimo] = await database.promise().query(`SELECT * FROM emprestimo WHERE id = ?`, [id]);

            if (emprestimo.length === 0) {
                throw new AppError("Empréstimo não encontrado", 404);
            }

            if (emprestimo[0].status === 'ativo' || emprestimo[0].status === 'atrasado' || emprestimo[0].status === 'pendente') {
                await database.promise().query(`UPDATE livro SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = ?`, [emprestimo[0].livro_id]);
            }

            await database.promise().query(`DELETE FROM emprestimo WHERE id = ?`, [id]);

            return res.status(200).json({ message: "Empréstimo cancelado com sucesso!" });

        } catch (error) {
            console.error("Erro ao deletar empréstimo:", error);
            next(error);
        }
    }
}

export { EmprestimoController }