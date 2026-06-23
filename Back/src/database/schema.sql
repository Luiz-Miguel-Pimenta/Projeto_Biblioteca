CREATE DATABASE biblioteca;

USE biblioteca;

CREATE TABLE usuario (
id INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(150) NOT NULL,
email VARCHAR(150) NOT NULL,
senha VARCHAR(100) NOT NULL,
perfil ENUM('bibliotecario', 'leitor') NOT NULL
);

CREATE TABLE livro (
id INT PRIMARY KEY AUTO_INCREMENT,
titulo VARCHAR(150) NOT NULL,
autor VARCHAR(150) NOT NULL,
ano_publicacao INT,
quantidade_disponivel INT NOT NULL
);

CREATE TABLE emprestimo (
id INT PRIMARY KEY AUTO_INCREMENT,
livro_id INT NOT NULL,
leitor_id INT NOT NULL,
data_emprestimo DATE NOT NULL,
data_devolucao_prevista DATE NOT NULL,
data_devolucao_real DATE,
status ENUM('ativo', 'devolvido', 'atrasado','pendente') NOT NULL,
FOREIGN KEY (livro_id) REFERENCES livro(id),
FOREIGN KEY (leitor_id) REFERENCES usuario(id)
);

INSERT INTO livro (titulo, autor, ano_publicacao, quantidade_disponivel) VALUES 
('Código Limpo', 'Robert C. Martin', 2009, 5),
('Arquitetura Limpa', 'Robert C. Martin', 2017, 3),
('O Design do Dia a Dia', 'Don Norman', 1988, 4),
('Dom Casmurro', 'Machado de Assis', 1899, 8),
('1984', 'George Orwell', 1949, 6),
('O Hobbit', 'J.R.R. Tolkien', 1937, 7),
('Sapiens: Uma Breve História da Humanidade', 'Yuval Noah Harari', 2011, 4),
('O Alquimista', 'Paulo Coelho', 1988, 10);

INSERT INTO emprestimo (livro_id, leitor_id, data_emprestimo, data_devolucao_prevista, data_devolucao_real, status) VALUES 

(1, 1, CURDATE() - INTERVAL 5 DAY, CURDATE() + INTERVAL 25 DAY, NULL, 'ativo'),
(2, 1, CURDATE() - INTERVAL 2 DAY, CURDATE() + INTERVAL 28 DAY, NULL, 'ativo'),

(3, 1, '2026-05-01', '2026-05-31', '2026-05-20', 'devolvido'),
(4, 1, '2026-04-10', '2026-05-10', '2026-05-08', 'devolvido'),

(5, 1, '2026-04-01', '2026-05-01', NULL, 'atrasado'),
(6, 1, '2026-03-15', '2026-04-15', NULL, 'atrasado'),

(7, 1, CURDATE(), CURDATE() + INTERVAL 30 DAY, NULL, 'pendente'),
(8, 1, CURDATE(), CURDATE() + INTERVAL 30 DAY, NULL, 'pendente');