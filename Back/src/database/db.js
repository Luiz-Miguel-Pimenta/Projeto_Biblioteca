import mysql from "mysql2"
import "dotenv/config"

const database = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
}) 

database.connect(error => {
    if(error) {
        throw error
    };
    console.log('conectado ao banco de dados');
})

export { database }

/*
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
status ENUM('ativo', 'devolvido', 'atrasado') NOT NULL,
FOREIGN KEY (livro_id) REFERENCES livro(id),
FOREIGN KEY (leitor_id) REFERENCES usuario(id)
);
*/