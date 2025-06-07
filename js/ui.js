import { APP_CONSTANTS } from './config.js';
import { addRecipe, deleteRecipe, updateRecipe } from './recipes.js';

// UI state
let currentSearchTerm = '';
let currentFilterCategory = 'All';

/**
 * Initialize UI components and event listeners
 */
export function initializeUI() {
    setupEventListeners();
    setupSearchAndFilter();
    setupFormValidation();
}

/**
 * Set up event listeners for UI elements
 */
function setupEventListeners() {
    const toggleButton = document.getElementById('toggleManualInputButton');
    const cancelButton = document.getElementById('cancelButton');
    const recipeForm = document.getElementById('recipeForm');

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            console.log('Add New Recipe button clicked'); // Added log
            toggleManualInput();
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            toggleManualInput();
            clearForm();
        });
    }

    if (recipeForm) {
        recipeForm.addEventListener('submit', handleRecipeSubmit);
    }
}

/**
 * Set up search and filter functionality
 */
function setupSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    if (searchInput) {
        let debounceTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                currentSearchTerm = e.target.value.toLowerCase();
                window.dispatchEvent(new CustomEvent('searchFilterChanged', {
                    detail: { searchTerm: currentSearchTerm, filterCategory: currentFilterCategory }
                }));
            }, APP_CONSTANTS.SEARCH_DEBOUNCE_MS);
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            currentFilterCategory = e.target.value;
            window.dispatchEvent(new CustomEvent('searchFilterChanged', {
                detail: { searchTerm: currentSearchTerm, filterCategory: currentFilterCategory }
            }));
        });
    }
}

/**
 * Set up form validation
 */
function setupFormValidation() {
    const form = document.getElementById('recipeForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => validateInput(input));
    });
}

/**
 * Validate a form input
 * @param {HTMLElement} input - Input element to validate
 */
function validateInput(input) {
    const value = input.value;
    let isValid = true;
    let errorMessage = '';

    // Check required fields
    if (input.required && !value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Check maximum length
    const maxLength = input.getAttribute('maxlength');
    if (maxLength && value.length > maxLength) {
        isValid = false;
        errorMessage = `Maximum length is ${maxLength} characters`;
    }

    // Update UI
    input.classList.toggle('border-red-500', !isValid);
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.classList.toggle('hidden', isValid);
    }

    return isValid;
}

/**
 * Handle recipe form submission
 * @param {Event} e - Form submission event
 */
async function handleRecipeSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const recipeData = Object.fromEntries(formData.entries());

    // Validate form before submitting
    let isFormValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        displayErrorMessage('Please fill in all required fields correctly.');
        return;
    }

    try {
        showLoading('Saving recipe...');
        await addRecipe(recipeData);
        displaySuccessMessage('Recipe added successfully!');
        clearForm();
        toggleManualInput();
    } catch (error) {
        console.error('Error saving recipe:', error);
        displayErrorMessage('Failed to save recipe. Please try again.');
    } finally {
        hideLoading();
    }
}

/**
 * Toggle manual input form visibility
 */
function toggleManualInput() {
    console.log('toggleManualInput function called'); // Added log
    const section = document.getElementById('manualInputSection');
    if (section) {
        console.log('manualInputSection found, current classes:', section.className); // Added log
        section.classList.toggle('hidden');
        console.log('manualInputSection classes after toggle:', section.className); // Added log
    }
}

/**
 * Clear the recipe form
 */
function clearForm() {
    const form = document.getElementById('recipeForm');
    if (form) {
        form.reset();
    }
}

/**
 * Display an error message
 * @param {string} message - Error message to display
 */
export function displayErrorMessage(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        setTimeout(() => errorElement.classList.add('hidden'), APP_CONSTANTS.MESSAGE_TIMEOUT_MS);
    }
}

/**
 * Display a success message
 * @param {string} message - Success message to display
 */
export function displaySuccessMessage(message) {
    const successElement = document.getElementById('success-message');
    if (successElement) {
        successElement.textContent = message;
        successElement.classList.remove('hidden');
        setTimeout(() => successElement.classList.add('hidden'), APP_CONSTANTS.MESSAGE_TIMEOUT_MS);
    }
}

/**
 * Show loading overlay
 * @param {string} message - Loading message to display
 */
export function showLoading(message = 'Loading...') {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

/**
 * Hide loading overlay
 */
export function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}