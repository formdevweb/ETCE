// Importation des modules nécessaires
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Création de l'application Express
const app = express();
const port = 3000;

// Middleware pour autoriser les requêtes cross-origin et parser le JSON
app.use(cors());
app.use(express.json());

// Configuration de la connexion à la base de données
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'contact_db'
});

// Connexion à la base de données
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL:', err);
    return;
  }
  console.log('Connecté à MySQL');
});

// Route pour créer un contact
app.post('/contacts', (req, res) => {
  const { nom, email, message } = req.body;
  const query = 'INSERT INTO contacts (nom, email, message) VALUES (?, ?, ?)';
  connection.query(query, [nom, email, message], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la création du contact' });
      return;
    }
    res.status(201).json({ id: result.insertId, message: 'Contact créé avec succès' });
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
