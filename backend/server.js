/**
 * Configuration du serveur Express et des dépendances
 * ------------------------------------------------
 */
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Configuration des middlewares
app.use(cors());
app.use(express.json());

/**
 * Configuration de la base de données MySQL
 * ------------------------------------------------
 */
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'contact_db'
});

/**
 * Initialisation de la base de données
 * ------------------------------------------------
 */
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL:', err);
    return;
  }
  console.log('Connecté à MySQL');

  // Création de la table blog_posts avec ses champs
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

/**
 * Routes pour la gestion des articles
 * ------------------------------------------------
 */

/**
 * Récupère tous les articles
 * @route GET /api/blog-posts
 * @returns {Array} Liste des articles triés par date de création
 */
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

/**
 * Récupère un article spécifique
 * @route GET /api/blog-posts/:id
 * @param {number} id - ID de l'article à récupérer
 * @returns {Object} Article demandé
 */
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

/**
 * Crée un nouvel article
 * @route POST /api/blog-posts
 * @param {Object} req.body - Données de l'article
 * @param {string} req.body.title - Titre de l'article
 * @param {string} req.body.content - Contenu de l'article
 * @param {string} req.body.image_url - URL de l'image de l'article
 * @returns {Object} Message de confirmation et ID de l'article créé
 */
app.post('/api/blog-posts', (req, res) => {
  const { title, content, image_url } = req.body;

  // Validation des données requises
  if (!title || !content) {
    res.status(400).json({ error: 'Le titre et le contenu sont obligatoires' });
    return;
  }

  // Validation de la longueur du titre
  if (title.length > 255) {
    res.status(400).json({ error: 'Le titre ne doit pas dépasser 255 caractères' });
    return;
  }

  // Insertion dans la base de données
  const query = 'INSERT INTO blog_posts (title, content, image_url) VALUES (?, ?, ?)';
  connection.query(query, [title, content, image_url], (err, result) => {
    if (err) {
      console.error('Erreur MySQL:', err);
      res.status(500).json({
        error: 'Erreur lors de la création de l\'article. Veuillez vérifier que la base de données est bien configurée.'
      });
      return;
    }
    res.status(201).json({
      id: result.insertId,
      message: 'Article créé avec succès'
    });
  });
});

/**
 * Met à jour un article existant
 * @route PUT /api/blog-posts/:id
 * @param {number} id - ID de l'article à mettre à jour
 * @param {Object} req.body - Nouvelles données de l'article
 * @returns {Object} Message de confirmation
 */
app.put('/api/blog-posts/:id', (req, res) => {
  const { title, content, image_url } = req.body;

  // Validation des données
  if (!title || !content) {
    res.status(400).json({ error: 'Le titre et le contenu sont obligatoires' });
    return;
  }

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

/**
 * Supprime un article
 * @route DELETE /api/blog-posts/:id
 * @param {number} id - ID de l'article à supprimer
 * @returns {Object} Message de confirmation
 */
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

/**
 * Routes pour la gestion des contacts
 * ------------------------------------------------
 */

/**
 * Crée un nouveau contact
 * @route POST /contacts
 * @param {Object} req.body - Données du contact
 * @param {string} req.body.nom - Nom du contact
 * @param {string} req.body.email - Email du contact
 * @param {string} req.body.message - Message du contact
 * @returns {Object} Message de confirmation et ID du contact créé
 */
app.post('/contacts', (req, res) => {
  const { nom, email, message } = req.body;

  // Validation des données
  if (!nom || !email || !message) {
    res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    return;
  }

  const query = 'INSERT INTO contacts (nom, email, message) VALUES (?, ?, ?)';
  connection.query(query, [nom, email, message], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la création du contact' });
      return;
    }
    res.status(201).json({
      id: result.insertId,
      message: 'Contact créé avec succès'
    });
  });
});

/**
 * Démarrage du serveur
 * ------------------------------------------------
 */
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
