import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { firebaseConfig } from './config.js';

// Initialize Firebase app if not already initialized
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  // Already initialized
}
const auth = getAuth();

window.addEventListener('DOMContentLoaded', () => {
  const loginSection = document.getElementById('login-section');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const mainContent = document.querySelector('.container');

  // Show login form, hide main content
  if (loginSection && mainContent) {
    loginSection.classList.remove('hidden');
    mainContent.classList.add('hidden');
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      loginError.classList.add('hidden');
      try {
        await signInWithEmailAndPassword(auth, email, password);
        // On success, hide login, show main content
        if (loginSection && mainContent) {
          loginSection.classList.add('hidden');
          mainContent.classList.remove('hidden');
        }
      } catch (err) {
        loginError.textContent = 'Login failed. Please check your credentials.';
        loginError.classList.remove('hidden');
      }
    });
  }
}); 