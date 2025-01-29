const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Connexion à la base de données MySQL
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'db',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DB || 'etce_db',
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connecté à la base de données MySQL');
  }
});

// Route d'exemple
app.get('/api', (req, res) => {
  res.json({ message: 'Bienvenue sur le backend de ETCE INGENIERIE' });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Backend en écoute sur http://localhost:${port}`);
});