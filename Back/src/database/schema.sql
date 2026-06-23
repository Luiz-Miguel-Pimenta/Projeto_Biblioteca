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

