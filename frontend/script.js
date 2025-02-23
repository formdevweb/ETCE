// ===============================================
// FONCTIONNALITÉS COMMUNES
// ===============================================

// Gestion du menu mobile
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// ===============================================
// PAGE CONTACT
// ===============================================

// Fonction pour afficher un message de réponse
function showResponseMessage(element, message, isSuccess) {
  element.textContent = message;
  element.className = isSuccess
    ? 'text-green-800 border border-green-500 p-3 rounded-lg bg-green-100 shadow-sm'
    : 'text-red-800 border border-red-500 p-3 rounded-lg bg-red-100 shadow-sm';

  setTimeout(() => {
    element.textContent = '';
    element.className = '';
  }, 2000);
}

// Initialisation du formulaire de contact
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      nom: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
    };

    try {
      const response = await fetch('http://localhost:3000/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      const responseElement = document.getElementById('response');

      if (response.ok) {
        showResponseMessage(responseElement, 'Message envoyé avec succès !', true);
        contactForm.reset();
      } else {
        showResponseMessage(responseElement, 'Erreur lors de l\'envoi du message : ' + result.error, false);
      }
    } catch (error) {
      console.error('Erreur:', error);
      const responseElement = document.getElementById('response');
      showResponseMessage(responseElement, 'Une erreur est survenue. Veuillez réessayer.', false);
    }
  });
}

// ===============================================
// PAGE BLOG
// ===============================================

// Variables globales pour la gestion du blog
let articles = [];
let editingArticleId = null;

// Fonction pour afficher les articles
function displayArticles() {
  const articlesList = document.getElementById("articlesList");
  if (!articlesList) return;

  articlesList.innerHTML = "";
  articles.forEach((article) => {
    const date = new Date(article.date).toLocaleDateString("fr-FR");
    const articleElement = document.createElement("div");
    articleElement.className =
      "bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 border border-gray-100";
    articleElement.innerHTML = `
      <div class="relative">
        <img src="${article.imageUrl}" alt="${article.title}" class="w-full h-48 object-cover">
        <div class="absolute top-0 right-0 m-4 bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-sm font-semibold">
          ${date}
        </div>
      </div>
      <div class="p-6">
        <h3 class="text-xl font-bold mb-3 text-gray-800">${article.title}</h3>
        <p class="text-gray-600 mb-4 line-clamp-3">${article.content}</p>
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button onclick="handleEditArticle(${article.id})" class="flex items-center px-4 py-2 bg-yellow-400 text-blue-900 rounded-lg hover:bg-yellow-500 transition-colors font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier
          </button>
          <button onclick="handleDeleteArticle(${article.id})" class="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Supprimer
          </button>
        </div>
      </div>
    `;
    articlesList.appendChild(articleElement);
  });
}

// Fonction pour charger les articles depuis l'API
async function loadArticles() {
  try {
    const response = await fetch("http://localhost:3000/articles");
    articles = await response.json();
    displayArticles();
  } catch (error) {
    console.error("Erreur lors du chargement des articles:", error);
  }
}

// Gestion du modal
function toggleModal(show) {
  const modal = document.getElementById("articleModal");
  if (show) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  } else {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }
}

// Fonctions de gestion des articles exposées globalement
window.handleEditArticle = async (id) => {
  const article = articles.find((a) => a.id === id);
  if (!article) return;

  editingArticleId = id;
  document.getElementById("modalTitle").textContent = "Modifier l'Article";
  document.getElementById("articleTitle").value = article.title;
  document.getElementById("articleImage").value = article.imageUrl;
  document.getElementById("articleContent").value = article.content;
  toggleModal(true);
};

window.handleDeleteArticle = async (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
    try {
      const response = await fetch(`http://localhost:3000/articles/${id}`, {
        method: "DELETE",
      });
      await response.json();
      await loadArticles();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Une erreur est survenue lors de la suppression de l'article.");
    }
  }
};

// Initialisation de la page blog
function initBlogPage() {
  const addArticleBtn = document.getElementById("addArticleBtn");
  const articleModal = document.getElementById("articleModal");
  const articleForm = document.getElementById("articleForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const searchInput = document.getElementById("searchArticle");

  // Vérifier si nous sommes sur la page blog
  if (!document.getElementById("articlesList")) return;

  // Charger les articles au démarrage
  loadArticles();

  // Gestion du modal d'ajout/modification d'article
  if (addArticleBtn && articleModal) {
    addArticleBtn.addEventListener("click", () => {
      editingArticleId = null;
      document.getElementById("modalTitle").textContent = "Ajouter un Article";
      articleForm.reset();
      toggleModal(true);
    });
  }

  if (cancelBtn && articleModal) {
    cancelBtn.addEventListener("click", () => toggleModal(false));
  }

  // Gestion du formulaire d'article
  if (articleForm) {
    articleForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const articleData = {
        title: document.getElementById("articleTitle").value,
        imageUrl: document.getElementById("articleImage").value,
        content: document.getElementById("articleContent").value,
        date: new Date().toISOString(),
      };

      try {
        const url = editingArticleId
          ? `http://localhost:3000/articles/${editingArticleId}`
          : "http://localhost:3000/articles";

        const response = await fetch(url, {
          method: editingArticleId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(articleData),
        });

        await response.json();
        toggleModal(false);
        await loadArticles();
      } catch (error) {
        console.error("Erreur:", error);
        alert("Une erreur est survenue lors de l'enregistrement de l'article.");
      }
    });
  }

  // Gestion de la recherche d'articles
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredArticles = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm) ||
          article.content.toLowerCase().includes(searchTerm)
      );

      const articlesList = document.getElementById("articlesList");
      if (!articlesList) return;

      if (filteredArticles.length === 0) {
        articlesList.innerHTML = `
          <div class="col-span-full text-center py-8 text-gray-500">
            Aucun article ne correspond à votre recherche.
          </div>
        `;
      } else {
        const originalArticles = [...articles];
        articles = filteredArticles;
        displayArticles();
        articles = originalArticles;
      }
    });
  }
}

// ===============================================
// INITIALISATION AU CHARGEMENT DE LA PAGE
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initBlogPage();
});
