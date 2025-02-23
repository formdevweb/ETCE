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

  // Création de la table blog_posts si elle n'existe pas
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      image_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table blog_posts:', err);
      return;
    }
    console.log('Table blog_posts prête');
  });
});

// Routes pour le blog
// GET - Récupérer tous les articles
app.get('/api/blog-posts', (req, res) => {
  const query = 'SELECT * FROM blog_posts ORDER BY created_at DESC';
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
      return;
    }
    res.json(results);
  });
});

// GET - Récupérer un article spécifique
app.get('/api/blog-posts/:id', (req, res) => {
  const query = 'SELECT * FROM blog_posts WHERE id = ?';
  connection.query(query, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'article' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Article non trouvé' });
      return;
    }
    res.json(results[0]);
  });
});

// POST - Créer un nouvel article
app.post('/api/blog-posts', (req, res) => {
  const { title, content, image_url } = req.body;
  const query = 'INSERT INTO blog_posts (title, content, image_url) VALUES (?, ?, ?)';
  connection.query(query, [title, content, image_url], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la création de l\'article' });
      return;
    }
    res.status(201).json({ id: result.insertId, message: 'Article créé avec succès' });
  });
});

// PUT - Mettre à jour un article
app.put('/api/blog-posts/:id', (req, res) => {
  const { title, content, image_url } = req.body;
  const query = 'UPDATE blog_posts SET title = ?, content = ?, image_url = ? WHERE id = ?';
  connection.query(query, [title, content, image_url, req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'article' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Article non trouvé' });
      return;
    }
    res.json({ message: 'Article mis à jour avec succès' });
  });
});

// DELETE - Supprimer un article
app.delete('/api/blog-posts/:id', (req, res) => {
  const query = 'DELETE FROM blog_posts WHERE id = ?';
  connection.query(query, [req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'article' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Article non trouvé' });
      return;
    }
    res.json({ message: 'Article supprimé avec succès' });
  });
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
