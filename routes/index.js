var express = require('express');
var router = express.Router();
const db = require('../db');  // Importar o banco de dados

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express'  });
});

/* GET cadastro page. */
router.get('/cadastro', function(req, res, next) {
  res.render('cadastro', { title: 'Express',  error: null  });
});

/* GET home page. */
router.get('/home', (req, res) => {
  // Verificar se o usuário está autenticado e se o nome de usuário está na sessão
  if (req.session && req.session.usuario) {
    res.render('home', { usuario: req.session.usuario });
  } else {
    res.redirect('/'); // Redirecionar para a página de login se o usuário não estiver autenticado
  }
});

// Página de cadastro
router.get('/register', (req, res) => {
  res.render('register');  // Crie a visualização de registro, se necessário
});

// Processar o cadastro
router.post('/register', (req, res) => {
  const { usuario, email, endereco, senha } = req.body;

  // Verificar se o usuário ou email já existe
  db.get('SELECT * FROM users WHERE usuario = ? OR email = ?', [usuario, email], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Erro ao verificar usuário');
    }
    if (row) {
      // Usuário ou email já existe
      return res.render('cadastro', { title: 'Express', error: 'Usuário ou email já cadastrado' });
    } else {
      // Inserir novo usuário
      db.run(`INSERT INTO users (usuario, email, endereco, senha) VALUES (?, ?, ?, ?)`, 
        [usuario, email, endereco, senha], function(err) {
          if (err) {
            console.error(err.message);
            return res.status(500).send('Erro ao registrar usuário');
          }
          res.redirect('/');
        });
    }
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
// Editar usuário
router.get('/edit/:id', (req, res) => {
  const userId = req.params.id;
  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Erro ao buscar usuário');
    }
    res.render('edit', { user: row });
  });
});

router.post('/edit/:id', (req, res) => {
  const userId = req.params.id;
  const { usuario, email, endereco, senha } = req.body;
  db.run(`UPDATE users SET usuario = ?, email = ?, endereco = ?, senha = ? WHERE id = ?`, 
    [usuario, email, endereco, senha, userId], function(err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Erro ao editar usuário');
      }
      res.redirect('/users');
    });
});

// Excluir usuário
router.post('/delete/:id', (req, res) => {
  const userId = req.params.id;
  db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Erro ao excluir usuário');
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
      return res.status(500).send('Erro ao fazer login');
    }
    if (row) {
      req.session.usuario = usuario;  // Configurar o nome de usuário na sessão
      res.redirect('/home');  // Redireciona para a página inicial se o login for bem-sucedido
    } else {
      res.send('Usuário ou senha incorretos');  // Mostra mensagem de erro
    }
  });
});

module.exports = router;
