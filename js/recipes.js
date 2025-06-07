import { getFirestore, doc, addDoc, setDoc, deleteDoc, onSnapshot, collection, query, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';
import { getCurrentUserId } from './auth.js'; // Still needed for consistency, though user is mocked
import { APP_CONSTANTS } from './config.js'; // May still use constants
import { displayErrorMessage, displaySuccessMessage, openEditModal } from './ui.js'; // Assuming openEditModal exists in ui.js

// Local storage key
const RECIPES_STORAGE_KEY = 'user_recipes';

// State
let recipes = [];
let unsubscribeRecipes = null;

/**
 * Initialize recipes functionality
 */
export async function initializeRecipes() {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('User must be authenticated to initialize recipes');
    }

    setupRecipesListener();
    setupSearchFilter();
}

/**
 * Set up real-time listener for recipes
 */
function setupRecipesListener() {
    const db = getFirestore();
    const userId = getCurrentUserId();
    const recipesRef = collection(db, `users/${userId}/${COLLECTIONS.RECIPES}`);
    const q = query(recipesRef);

    // Unsubscribe from previous listener if exists
    if (unsubscribeRecipes) {
        unsubscribeRecipes();
    }

    unsubscribeRecipes = onSnapshot(q, (snapshot) => {
        recipes = [];
        snapshot.forEach((doc) => {
            recipes.push({ id: doc.id, ...doc.data() });
        });
        recipes.sort((a, b) => a.itemName.localeCompare(b.itemName));
        displayRecipes();
    }, (error) => {
        console.error('Error loading recipes:', error);
        displayErrorMessage('Failed to load recipes. Please check your connection.');
    });
}

/**
 * Set up search and filter functionality
 */
function setupSearchFilter() {
    window.addEventListener('searchFilterChanged', (e) => {
        const { searchTerm, filterCategory } = e.detail;
        filterAndDisplayRecipes(searchTerm, filterCategory);
    });
}

/**
 * Filter and display recipes based on search term and category
 * @param {string} searchTerm - Search term
 * @param {string} filterCategory - Category to filter by
 */
function filterAndDisplayRecipes(searchTerm, filterCategory) {
    const lowerSearchTerm = searchTerm ? searchTerm.toLowerCase() : '';
    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = !lowerSearchTerm || 
            (recipe.itemName && recipe.itemName.toLowerCase().includes(lowerSearchTerm)) ||
            (recipe.description && recipe.description.toLowerCase().includes(lowerSearchTerm)) ||
            (recipe.ingredients && recipe.ingredients.some(ing => ing.toLowerCase().includes(lowerSearchTerm))) ||
            (recipe.instructions && recipe.instructions.some(inst => inst.toLowerCase().includes(lowerSearchTerm)));

        const matchesCategory = filterCategory === 'All' ||
            (recipe.categories && recipe.categories.includes(filterCategory));

        return matchesSearch && matchesCategory;
    });

    displayRecipes(filteredRecipes);
}

/**
 * Display recipes in the UI
 * @param {Array} recipesToDisplay - Recipes to display (optional, defaults to all recipes)
 */
function displayRecipes(recipesToDisplay = recipes) {
    const container = document.getElementById('recipe-container');
    if (!container) return;

    container.innerHTML = recipesToDisplay.length === 0 ?
        '<p class="text-center text-gray-500 col-span-full">No recipes found. Try adjusting your search or add a new recipe.</p>' : '';

    recipesToDisplay.forEach(recipe => {
        const card = createRecipeCard(recipe);
        container.appendChild(card);
    });
}

/**
 * Create a recipe card element
 * @param {Object} recipe - Recipe data
 * @returns {HTMLElement} Recipe card element
 */
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-lg overflow-hidden recipe-card';
    // Ensure all fields are checked for existence before trying to access them
    const itemName = recipe.itemName || 'Unnamed Recipe';
    const categories = recipe.categories || [];
    const description = recipe.description || 'No description provided.';
    const ingredients = recipe.ingredients || [];
    const instructions = recipe.instructions || [];
    const notes = recipe.notes || '';

    card.innerHTML = `
        <div class="p-6">
            <h3 class="text-2xl font-playfair text-amber-700 mb-3">${itemName}</h3>
            ${categories.length > 0 ? `<p class="text-xs text-amber-500 mb-2">Categories: ${categories.join(', ')}</p>` : ''}
            <p class="text-gray-600 text-sm mb-4">${description}</p>
            
            ${ingredients.length > 0 ? `
            <div class="mt-4">
                <h4 class="font-semibold text-amber-600">Ingredients:</h4>
                <ul class="list-disc list-inside text-gray-700 text-sm mt-2">
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>` : ''}

            ${instructions.length > 0 ? `
            <div class="mt-4">
                <h4 class="font-semibold text-amber-600">Instructions:</h4>
                <ol class="list-decimal list-inside text-gray-700 text-sm mt-2">
                    ${instructions.map(inst => `<li>${inst}</li>`).join('')}
                </ol>
            </div>` : ''}

            ${notes ? `
                <div class="mt-4">
                    <h4 class="font-semibold text-amber-600">Notes:</h4>
                    <p class="text-gray-600 italic text-sm mt-2">${notes}</p>
                </div>
            ` : ''}

            <div class="mt-6 flex justify-end space-x-2">
                <button class="edit-recipe px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        data-recipe-id="${recipe.id}">Edit</button>
                <button class="delete-recipe px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        data-recipe-id="${recipe.id}">Delete</button>
            </div>
        </div>
    `;

    // Add event listeners
    card.querySelector('.edit-recipe').addEventListener('click', () => handleEditRecipe(recipe.id));
    card.querySelector('.delete-recipe').addEventListener('click', () => handleDeleteRecipe(recipe.id));

    return card;
}

/**
 * Add a new recipe to local storage
 * @param {Object} recipeData - Recipe data
 */
export async function addRecipe(recipeData) {
    try {
        const newRecipe = {
            ...recipeData,
            id: Date.now().toString(), // Simple unique ID
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        recipes.push(newRecipe);
        recipes.sort((a, b) => (a.itemName || '').localeCompare(b.itemName || ''));
        saveRecipesToLocalStorage();
        displayRecipes();
        displaySuccessMessage('Recipe added successfully!');
    } catch (error) {
        console.error('Error adding recipe:', error);
        displayErrorMessage('Failed to add recipe.');
        // No need to throw error, just display message
    }
}

/**
 * Update an existing recipe in local storage
 * @param {string} recipeId - Recipe ID
 * @param {Object} recipeData - Updated recipe data
 */
export async function updateRecipe(recipeId, recipeData) {
    try {
        const recipeIndex = recipes.findIndex(r => r.id === recipeId);
        if (recipeIndex === -1) {
            throw new Error('Recipe not found for update');
        }
        recipes[recipeIndex] = {
            ...recipes[recipeIndex], // Keep existing fields like id, createdAt
            ...recipeData,
            updatedAt: new Date().toISOString()
        };
        recipes.sort((a, b) => (a.itemName || '').localeCompare(b.itemName || ''));
        saveRecipesToLocalStorage();
        displayRecipes();
        displaySuccessMessage('Recipe updated successfully!');
    } catch (error) {
        console.error('Error updating recipe:', error);
        displayErrorMessage('Failed to update recipe.');
    }
}

/**
 * Delete a recipe from local storage
 * @param {string} recipeId - Recipe ID
 */
async function handleDeleteRecipe(recipeId) {
    try {
        // Optional: Add a confirmation dialog here
        // if (!confirm('Are you sure you want to delete this recipe?')) return;

        recipes = recipes.filter(r => r.id !== recipeId);
        saveRecipesToLocalStorage();
        displayRecipes();
        displaySuccessMessage('Recipe deleted successfully!');
    } catch (error) {
        console.error('Error deleting recipe:', error);
        displayErrorMessage('Failed to delete recipe.');
    }
}

/**
 * Handle editing a recipe
 * @param {string} recipeId - Recipe ID
 */
function handleEditRecipe(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
        // Assuming you have a function in ui.js to open a modal and populate it
        openEditModal(recipe); 
    } else {
        displayErrorMessage('Recipe not found for editing.');
    }
}

// Export any other functions that ui.js or app.js might need
// For example, if you need to get a specific recipe by ID:
export function getRecipeById(recipeId) {
    return recipes.find(r => r.id === recipeId);
}