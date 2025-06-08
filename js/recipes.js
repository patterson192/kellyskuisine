import { getFirestore, doc, addDoc, setDoc, deleteDoc, onSnapshot, collection, query, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getCurrentUserId } from './auth.js'; // Still needed for consistency, though user is mocked
import { APP_CONSTANTS, COLLECTIONS } from './config.js'; // Import COLLECTIONS as well
import { displayErrorMessage, displaySuccessMessage, openEditModal } from './ui.js'; // Assuming openEditModal exists in ui.js
import { app } from './auth.js'; // Import the Firebase app instance

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
    const db = getFirestore(app);
    const userId = getCurrentUserId();
    console.log('[Recipes] Setting up listener for user:', userId);
    
    if (!userId) {
        console.error('[Recipes] No user ID available, cannot set up recipes listener');
        displayErrorMessage('User authentication required to load recipes');
        return;
    }
    
    const recipesRef = collection(db, "users", userId, COLLECTIONS.RECIPES);
    const q = query(recipesRef);
    console.log('[Recipes] Firestore collection path:', `users/${userId}/${COLLECTIONS.RECIPES}`);
    console.log('[Recipes] Full collection reference:', recipesRef);

    // Unsubscribe from previous listener if exists
    if (unsubscribeRecipes) {
        console.log('[Recipes] Unsubscribing from previous listener');
        unsubscribeRecipes();
    }

    console.log('[Recipes] Starting Firestore listener...');
    unsubscribeRecipes = onSnapshot(q, (snapshot) => {
        console.log(`[Recipes] ✅ Snapshot received successfully!`);
        console.log(`[Recipes] Empty: ${snapshot.empty}, Size: ${snapshot.size}`);
        console.log(`[Recipes] Snapshot metadata:`, snapshot.metadata);
        
        recipes = [];
        snapshot.forEach((doc) => {
            const recipeData = { id: doc.id, ...doc.data() };
            console.log('[Recipes] Processing recipe document:', {
                id: doc.id,
                data: doc.data(),
                fullRecipe: recipeData
            });
            recipes.push(recipeData);
        });
        
        console.log('[Recipes] Final processed recipes array:', recipes);
        console.log('[Recipes] Number of recipes loaded:', recipes.length);
        
        recipes.sort((a, b) => (a.itemName || '').localeCompare(b.itemName || ''));
        
        console.log('[Recipes] Calling displayRecipes...');
        displayRecipes();
        console.log('[Recipes] displayRecipes completed');
        
    }, (error) => {
        console.error('[Recipes] ❌ Error in Firestore listener:', error);
        console.error('[Recipes] Error details:', {
            code: error.code,
            message: error.message,
            stack: error.stack
        });
        
        // More specific error messages
        if (error.code === 'permission-denied') {
            displayErrorMessage('Permission denied: Please check your Firestore security rules');
        } else if (error.code === 'unavailable') {
            displayErrorMessage('Database unavailable: Please check your internet connection');
        } else {
            displayErrorMessage(`Failed to load recipes: ${error.message}`);
        }
    });
    
    console.log('[Recipes] Listener setup completed, unsubscribe function:', unsubscribeRecipes);
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
    console.log('[Recipes] 🎯 displayRecipes called');
    console.log('[Recipes] Recipes to display:', recipesToDisplay);
    console.log('[Recipes] Number of recipes to display:', recipesToDisplay.length);
    
    const container = document.getElementById('recipe-container');
    if (!container) {
        console.error('[Recipes] ❌ Recipe container element not found!');
        console.error('[Recipes] Available elements with "recipe" in ID:', 
            Array.from(document.querySelectorAll('[id*="recipe"]')).map(el => el.id));
        return;
    }
    
    console.log('[Recipes] ✅ Recipe container found:', container);
    console.log('[Recipes] Container styles:', {
        display: window.getComputedStyle(container).display,
        height: window.getComputedStyle(container).height,
        width: window.getComputedStyle(container).width,
        visibility: window.getComputedStyle(container).visibility,
        position: window.getComputedStyle(container).position
    });
    console.log('[Recipes] Container current content length:', container.innerHTML.length);

    if (recipesToDisplay.length === 0) {
        const message = '<p class="text-center text-gray-500 col-span-full">No recipes found. Try adjusting your search or add a new recipe.</p>';
        container.innerHTML = message;
        console.log('[Recipes] 📝 Displayed "no recipes" message');
    } else {
        container.innerHTML = ''; // Clear existing content
        console.log('[Recipes] 🧹 Cleared container, adding recipe cards...');
        
        recipesToDisplay.forEach((recipe, index) => {
            console.log(`[Recipes] Creating card ${index + 1}/${recipesToDisplay.length} for recipe:`, recipe.itemName);
            try {
                const card = createRecipeCard(recipe);
                container.appendChild(card);
                console.log(`[Recipes] ✅ Card ${index + 1} added successfully`);
            } catch (error) {
                console.error(`[Recipes] ❌ Error creating card ${index + 1}:`, error);
            }
        });
        
        console.log('[Recipes] 🎉 All recipe cards added to container');
    }
    
    console.log('[Recipes] Final container content length:', container.innerHTML.length);
}

/**
 * Create a recipe card element
 * @param {Object} recipe - Recipe data
 * @returns {HTMLElement} Recipe card element
 */
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-lg overflow-hidden recipe-card flex flex-col justify-between min-h-[300px] w-full';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'p-6';

    const itemName = recipe.itemName || 'Unnamed Recipe';
    const categories = recipe.categories || [];
    const description = recipe.description || '';
    const ingredients = recipe.ingredients || [];
    const instructions = recipe.instructions || [];
    const notes = recipe.notes || '';

    // Title
    const title = document.createElement('h3');
    title.className = 'text-2xl font-playfair text-amber-700 mb-3';
    title.textContent = itemName;
    contentDiv.appendChild(title);

    // Categories
    if (categories.length > 0) {
        const p = document.createElement('p');
        p.className = 'text-xs text-amber-500 mb-2';
        p.textContent = `Categories: ${categories.join(', ')}`;
        contentDiv.appendChild(p);
    }
    
    // Description
    if (description) {
        const p = document.createElement('p');
        p.className = 'text-gray-600 text-sm mb-4';
        p.textContent = description;
        contentDiv.appendChild(p);
    }

    // A helper function to create sections
    const createSection = (titleText, items, isOrdered) => {
        if (items.length === 0) return;
        const div = document.createElement('div');
        div.className = 'mt-4';
        const h4 = document.createElement('h4');
        h4.className = 'font-semibold text-amber-600';
        h4.textContent = titleText;
        div.appendChild(h4);
        const list = document.createElement(isOrdered ? 'ol' : 'ul');
        list.className = `${isOrdered ? 'list-decimal' : 'list-disc'} list-inside text-gray-700 text-sm mt-2`;
        items.forEach(itemText => {
            const li = document.createElement('li');
            li.textContent = itemText;
            list.appendChild(li);
        });
        div.appendChild(list);
        contentDiv.appendChild(div);
    };

    createSection('Ingredients:', ingredients, false);
    createSection('Instructions:', instructions, true);

    // Notes
    if (notes) {
        const notesDiv = document.createElement('div');
        notesDiv.className = 'mt-4';
        const notesTitle = document.createElement('h4');
        notesTitle.className = 'font-semibold text-amber-600';
        notesTitle.textContent = 'Notes:';
        notesDiv.appendChild(notesTitle);
        const notesP = document.createElement('p');
        notesP.className = 'text-gray-600 italic text-sm mt-2';
        notesP.textContent = notes;
        notesDiv.appendChild(notesP);
        contentDiv.appendChild(notesDiv);
    }
    
    card.appendChild(contentDiv);

    // Button container
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'p-6 pt-0 flex justify-end space-x-2';

    const editButton = document.createElement('button');
    editButton.className = 'edit-recipe px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm';
    editButton.textContent = 'Edit';
    editButton.dataset.recipeId = recipe.id;
    editButton.addEventListener('click', () => handleEditRecipe(recipe.id));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-recipe px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm';
    deleteButton.textContent = 'Delete';
    deleteButton.dataset.recipeId = recipe.id;
    deleteButton.addEventListener('click', () => deleteRecipe(recipe.id));

    buttonDiv.appendChild(editButton);
    buttonDiv.appendChild(deleteButton);
    card.appendChild(buttonDiv);

    return card;
}

/**
 * Add a new recipe to Firestore
 * @param {Object} recipeData - The recipe data to add.
 */
export async function addRecipe(recipeData) {
    try {
        console.log('Starting to add recipe:', recipeData);
        const db = getFirestore(app);
        const userId = getCurrentUserId();
        console.log('Current user ID:', userId);
        
        if (!userId) throw new Error('User not authenticated for adding recipe.');
        
        const recipesRef = collection(db, 'users', userId, 'recipes');
        console.log('Firestore collection path:', `users/${userId}/recipes`);
        
        const newRecipe = {
            ...recipeData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        
        console.log('Attempting to save recipe to Firestore...');
        const docRef = await addDoc(recipesRef, newRecipe);
        console.log('Recipe saved successfully with ID:', docRef.id);
        displaySuccessMessage('Recipe added successfully!');
    } catch (error) {
        console.error('Error adding recipe to Firestore:', error);
        console.error('Error details:', {
            code: error.code,
            message: error.message,
            stack: error.stack
        });
        displayErrorMessage(`Failed to add recipe: ${error.message}`);
        throw error;
    }
}

/**
 * Update an existing recipe in Firestore
 * @param {string} recipeId - The ID of the recipe to update.
 * @param {Object} recipeData - The updated recipe data.
 */
export async function updateRecipe(recipeId, recipeData) {
    try {
        const db = getFirestore(app);
        const userId = getCurrentUserId();
        if (!userId) throw new Error('User not authenticated for updating recipe.');
        
        const recipeRef = doc(db, 'users', userId, 'recipes', recipeId);
        const updatedData = {
            ...recipeData,
            updatedAt: serverTimestamp()
        };
        
        await setDoc(recipeRef, updatedData, { merge: true });
        displaySuccessMessage('Recipe updated successfully!');
    } catch (error) {
        console.error('Error updating recipe in Firestore:', error);
        displayErrorMessage('Failed to update recipe.');
        throw error;
    }
}

/**
 * Delete a recipe from Firestore
 * @param {string} recipeId - The ID of the recipe to delete.
 */
export async function deleteRecipe(recipeId) {
    try {
        if (!confirm('Are you sure you want to delete this recipe?')) return;

        const db = getFirestore(app);
        const userId = getCurrentUserId();
        if (!userId) throw new Error('User not authenticated for deleting recipe.');
        
        const recipeRef = doc(db, 'users', userId, 'recipes', recipeId);
        await deleteDoc(recipeRef);
        displaySuccessMessage('Recipe deleted successfully!');
    } catch (error) {
        console.error('Error deleting recipe from Firestore:', error);
        displayErrorMessage('Failed to delete recipe.');
        throw error;
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