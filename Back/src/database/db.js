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


