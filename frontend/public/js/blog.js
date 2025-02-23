/**
 * Configuration de l'API
 * ------------------------------------------------
 */
const API_URL = 'http://localhost:3000/api';

/**
 * Fonctions de gestion des articles
 * ------------------------------------------------
 */

/**
 * Récupère tous les articles depuis l'API
 * @async
 * @returns {Promise<void>}
 */
async function fetchArticles() {
  try {
    const response = await fetch(`${API_URL}/blog-posts`);
    const articles = await response.json();
    displayArticles(articles);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    showError('Impossible de charger les articles');
  }
}

/**
 * Affiche les articles dans l'interface utilisateur
 * @param {Array} articles - Liste des articles à afficher
 */
function displayArticles(articles) {
  const articlesContainer = document.getElementById('articlesList');
  articlesContainer.innerHTML = '';

  articles.forEach(article => {
    const articleElement = document.createElement('div');
    articleElement.className = 'bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300';
    articleElement.innerHTML = `
      <img src="${article.image_url}" alt="${article.title}" class="w-full h-48 object-cover">
      <div class="p-6">
        <h3 class="text-xl font-bold mb-2">${article.title}</h3>
        <p class="text-gray-600 mb-4">${article.content.substring(0, 150)}...</p>
        <div class="flex justify-between items-center">
          <button onclick="editArticle(${article.id})" class="text-blue-600 hover:text-blue-800">
            Modifier
          </button>
          <button onclick="deleteArticle(${article.id})" class="text-red-600 hover:text-red-800">
            Supprimer
          </button>
        </div>
      </div>
    `;
    articlesContainer.appendChild(articleElement);
  });
}

/**
 * Ajoute un nouvel article
 * @async
 * @param {Object} articleData - Données de l'article à créer
 * @param {string} articleData.title - Titre de l'article
 * @param {string} articleData.content - Contenu de l'article
 * @param {string} articleData.image_url - URL de l'image de l'article
 * @returns {Promise<void>}
 */
async function addArticle(articleData) {
  try {
    const response = await fetch(`${API_URL}/blog-posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData)
    });

    if (!response.ok) {
      console.error('Erreur lors de l\'ajout de l\'article');
      return;
    }

    await fetchArticles();
    closeModal();
  } catch (error) {
    console.error('Erreur:', error);
  }
}

/**
 * Modifie un article existant
 * @async
 * @param {number} id - ID de l'article à modifier
 * @returns {Promise<void>}
 */
async function editArticle(id) {
  try {
    const response = await fetch(`${API_URL}/blog-posts/${id}`);
    const article = await response.json();

    // Remplissage du formulaire
    document.getElementById('articleTitle').value = article.title;
    document.getElementById('articleImage').value = article.image_url;
    document.getElementById('articleContent').value = article.content;

    // Configuration du modal en mode édition
    const modal = document.getElementById('articleModal');
    modal.dataset.articleId = id;
    document.getElementById('modalTitle').textContent = 'Modifier l\'article';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  } catch (error) {
    console.error('Erreur:', error);
    showError('Impossible de charger l\'article');
  }
}

/**
 * Met à jour un article existant
 * @async
 * @param {number} id - ID de l'article à mettre à jour
 * @param {Object} articleData - Nouvelles données de l'article
 * @returns {Promise<void>}
 */
async function updateArticle(id, articleData) {
  try {
    const response = await fetch(`${API_URL}/blog-posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData)
    });

    if (!response.ok) throw new Error('Erreur lors de la mise à jour de l\'article');

    await fetchArticles();
    closeModal();
  } catch (error) {
    console.error('Erreur:', error);
    showError('Impossible de mettre à jour l\'article');
  }
}

/**
 * Supprime un article
 * @async
 * @param {number} id - ID de l'article à supprimer
 * @returns {Promise<void>}
 */
async function deleteArticle(id) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

  try {
    const response = await fetch(`${API_URL}/blog-posts/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Erreur lors de la suppression de l\'article');

    await fetchArticles();
  } catch (error) {
    console.error('Erreur:', error);
    showError('Impossible de supprimer l\'article');
  }
}

/**
 * Fonctions utilitaires
 * ------------------------------------------------
 */

/**
 * Affiche un message d'erreur à l'utilisateur
 * @param {string} message - Message d'erreur à afficher
 */
function showError(message) {
  alert(message); // TODO: Implémenter une meilleure UI pour les erreurs
}

/**
 * Ferme le modal et réinitialise le formulaire
 */
function closeModal() {
  const modal = document.getElementById('articleModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.getElementById('articleForm').reset();
  delete modal.dataset.articleId;
}

/**
 * Initialisation et gestionnaires d'événements
 * ------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', () => {
  // Chargement initial des articles
  fetchArticles();

  // Gestionnaire pour l'ouverture du modal d'ajout
  document.getElementById('addArticleBtn').addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Ajouter un Article';
    const modal = document.getElementById('articleModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  });

  // Gestionnaire pour la fermeture du modal
  document.getElementById('cancelBtn').addEventListener('click', closeModal);

  // Gestionnaire pour la soumission du formulaire
  document.getElementById('articleForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const articleData = {
      title: document.getElementById('articleTitle').value,
      image_url: document.getElementById('articleImage').value,
      content: document.getElementById('articleContent').value
    };

    const modal = document.getElementById('articleModal');
    const articleId = modal.dataset.articleId;

    if (articleId) {
      await updateArticle(articleId, articleData);
    } else {
      await addArticle(articleData);
    }
  });

  // Gestionnaire pour la recherche d'articles
  document.getElementById('searchArticle').addEventListener('input', async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    try {
      const response = await fetch(`${API_URL}/blog-posts`);
      const articles = await response.json();
      const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm)
      );
      displayArticles(filteredArticles);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      showError('Erreur lors de la recherche d\'articles');
    }
  });
}); 