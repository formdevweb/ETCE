const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Load more questions in the contact page
   // Manage the "Load More" button
   document.getElementById('load-more-btn').addEventListener('click', function () {
    const faqContainer = document.getElementById('faq-container');
    const hiddenQuestions = document.getElementById('hidden-questions');
    const questions = hiddenQuestions.querySelectorAll('div');

    // Add the hidden questions to the visible container
    questions.forEach(question => {
      faqContainer.appendChild(question);
    });

    // Hide the "Load More" button and show the "Load Less" button
    this.style.display = 'none';
    document.getElementById('load-less-btn').style.display = 'inline-block';

    // Clear the content of the hidden container
    hiddenQuestions.innerHTML = '';
  });

  // Manage the "Load Less" button
  document.getElementById('load-less-btn').addEventListener('click', function () {
    const faqContainer = document.getElementById('faq-container');
    const hiddenQuestions = document.getElementById('hidden-questions');

    // Get the visible questions (ignoring the first two)
    const visibleQuestions = Array.from(faqContainer.children).slice(2);

    // Move the visible questions back to the hidden container
    visibleQuestions.forEach(question => {
      hiddenQuestions.appendChild(question);
    });

    // Show the "Load More" button and hide the "Load Less" button
    this.style.display = 'none';
    document.getElementById('load-more-btn').style.display = 'inline-block';
  });

  // formulaire de contact

  // Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
  // Sélectionner le formulaire
  const form = document.getElementById('contactForm');
  
  // Ajouter un écouteur d'événement pour la soumission du formulaire
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page
    
    // Récupérer les valeurs du formulaire
    const formData = {
      nom: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
    };

    try {
      // Envoyer les données au serveur
      const response = await fetch('http://localhost:3000/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      // Afficher le résultat
      if (response.ok) {
        document.getElementById('response').textContent = 'Message envoyé avec succès !';
        document.getElementById('response').className = 'text-green-500 border border-green-500 p-2 rounded'; // Classes Tailwind pour le succès
        form.reset(); // Réinitialiser le formulaire

        // Masquer le message après 3 secondes
  setTimeout(() => {
    document.getElementById('response').textContent = ''; // Effacer le texte
    document.getElementById('response').className = ''; // Supprimer les classes
  }, 2000); // 3000 millisecondes = 3 secondes

      } else {
        document.getElementById('response').textContent = 'Erreur lors de l\'envoi du message : ' + result.error;
        document.getElementById('response').className = 'text-red-500 border border-red-500 p-2 rounded'; // Classes Tailwind pour l'erreur
      }
    } catch (error) {
      console.error('Erreur:', error);
      document.getElementById('response').textContent = 'Une erreur est survenue.';
      document.getElementById('response').className = 'text-red-500 border border-red-500 p-2 rounded'; // Classes Tailwind pour l'erreur
    }
  });
});
