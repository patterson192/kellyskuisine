import { initializeAuth } from './auth.js';
import { initializeUI } from './ui.js';
import { initializeRecipes } from './recipes.js';
// Remove Firebase config import
// import { firebaseConfig, appId } from './config.js';

// Initialize the application
async function initializeApp() {
    try {
        // Initialize authentication (now local)
        await initializeAuth(); // No longer pass firebaseConfig or appId
        
        // Initialize UI components
        initializeUI();
        
        // Load and display recipes
        await initializeRecipes();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize app:', error);
        displayGlobalError('Failed to initialize the application. Please refresh the page.');
    }
}

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error:', { message, source, lineno, colno, error });
    displayGlobalError('An unexpected error occurred. Please refresh the page.');
    return false;
};

// Global promise rejection handler
window.onunhandledrejection = function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    displayGlobalError('An unexpected error occurred. Please refresh the page.');
};

// Helper function for displaying global errors
function displayGlobalError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        setTimeout(() => errorElement.classList.add('hidden'), 5000);
    }
}

// Start the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);