import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

// Wait for Firebase to be initialized before setting up login
window.addEventListener('firebaseInitialized', () => {
  const auth = getAuth();
  
  const loginSection = document.getElementById('login-section');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const mainContent = document.querySelector('.container');

  // Check authentication state on page load
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, show main content
      if (loginSection && mainContent) {
        loginSection.classList.add('hidden');
        mainContent.classList.remove('hidden');
      }
    } else {
      // User is signed out, show login form
      if (loginSection && mainContent) {
        loginSection.classList.remove('hidden');
        mainContent.classList.add('hidden');
      }
    }
  });

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      loginError.classList.add('hidden');
      try {
        await signInWithEmailAndPassword(auth, email, password);
        // The onAuthStateChanged listener will handle showing/hiding content
      } catch (err) {
        loginError.textContent = 'Login failed. Please check your credentials.';
        loginError.classList.remove('hidden');
      }
    });
  }
}); 