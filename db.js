const { text } = require('body-parser');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users_db.sqlite');

db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, usuario TEXT NOT NULL, email TEXT NOT NULL, endereco TEXT NOT NULL, senha TEXT NOT NULL)");
  
  module.exports = db;