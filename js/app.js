import { initializeAuth } from './auth.js';
import { initializeUI } from './ui.js';
import { initializeRecipes } from './recipes.js';
import { firebaseConfig, appId } from './config.js';

// Initialize the application
async function initializeApp() {
    try {
        console.log('Starting application initialization...');
        
        // Initialize authentication with Firebase config
        console.log('Initializing Firebase authentication...');
        await initializeAuth(firebaseConfig, appId);
        console.log('Firebase authentication initialized successfully');
        
        // Initialize UI components
        console.log('Initializing UI components...');
        initializeUI();
        console.log('UI components initialized successfully');
        
        // Load and display recipes
        console.log('Initializing recipes...');
        await initializeRecipes();
        console.log('Recipes initialized successfully');
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize app:', error);
        const errorMessage = error.message || 'Unknown error occurred';
        displayGlobalError(`Failed to initialize the application: ${errorMessage}. Please refresh the page.`);
    }
}

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error:', { message, source, lineno, colno, error });
    const errorMessage = error ? error.message : message;
    displayGlobalError(`An unexpected error occurred: ${errorMessage}. Please refresh the page.`);
    return false;
};

// Global promise rejection handler
window.onunhandledrejection = function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    const errorMessage = event.reason ? event.reason.message : 'Unknown error';
    displayGlobalError(`An unexpected error occurred: ${errorMessage}. Please refresh the page.`);
};

// Helper function for displaying global errors
function displayGlobalError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        setTimeout(() => errorElement.classList.add('hidden'), 5000);
    } else {
        console.error('Error message element not found:', message);
    }
}

// Start the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);