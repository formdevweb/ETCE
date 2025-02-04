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