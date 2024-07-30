var express = require('express');
var router = express.Router();
const db = require('../db');  // Importar o banco de dados

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

/* GET cadastro page. */
router.get('/cadastro', function(req, res, next) {
  res.render('cadastro', { title: 'Express' });
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home', { title: 'Express' });
});

// Página de cadastro
router.get('/register', (req, res) => {
  res.render('register');  // Crie a visualização de registro, se necessário
});

// Processar o cadastro
router.post('/register', (req, res) => {
  const { usuario, email, endereco, senha } = req.body;

  db.run(`INSERT INTO users (usuario, email, endereco, senha) VALUES (?, ?, ?, ?)`, 
    [usuario, email, endereco, senha], function(err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Error registering user');
      }
      res.redirect('/users');
    });
});

// Listar todos os usuários
router.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Error fetching users');
    }
    res.render('users', { users: rows });  // Renderizar a visualização de usuários
  });
});

// Limpar todos os usuários
router.post('/limpar', (req, res) => {
  db.run('DELETE FROM users', function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Error clearing users');
    }
    res.redirect('/users');
  });
});

// Processar o login
router.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  db.get('SELECT * FROM users WHERE usuario = ? AND senha = ?', [usuario, senha], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Error logging in');
    }
    if (row) {
      res.redirect('/home');  // Redireciona para a página home se o login for bem-sucedido
    } else {
      res.send('Usuário ou senha incorretos');  // Mostra mensagem de erro
    }
  });
});

module.exports = router;
