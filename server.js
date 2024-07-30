const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Configurar o body-parser para lidar com requisições POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('users_db.sqlite');

// Criar a tabela de usuários, se não existir
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT,
    address TEXT,
    password TEXT
)`);

// Rota para processar o cadastro
app.post('/register', (req, res) => {
    const { username, email, address, password } = req.body;

    db.run(`INSERT INTO users (username, email, address, password) VALUES (?, ?, ?, ?)`, [username, email, address, password], function(err) {
        if (err) {
            return console.log(err.message);
        }
        res.send('User registered successfully');
    });
});

// Rota para exibir os usuários cadastrados
app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Usuários Cadastrados</title>
                <link rel="stylesheet" href="style-cadastro.css">
            </head>
            <body>
                <h1>Usuários Cadastrados</h1>
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Password</th>
                    </tr>
                    ${rows.map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${user.address}</td>
                        <td>${user.password}</td>
                    </tr>`).join('')}
                </table>
            </body>
            </html>
        `);
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
