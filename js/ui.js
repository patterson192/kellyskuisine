import { APP_CONSTANTS } from './config.js';
import { addRecipe, updateRecipe } from './recipes.js';

// UI state
let currentSearchTerm = '';
let currentFilterCategory = 'All';
let editingRecipeId = null; // To store the ID of the recipe being edited

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
    console.log("Attaching UI event listeners...");

    // Corrected to use IDs from index.html
    const manualEntryBox = document.getElementById('manualEntryBox');
    const ocrEntryBox = document.getElementById('ocrEntryBox');
    const addManualRecipeButton = document.getElementById('addManualRecipeButton');
    const cancelEditButton = document.getElementById('cancelEditButton');

    if (manualEntryBox) {
        manualEntryBox.addEventListener('click', () => {
            console.log('Manual entry box clicked!');
            document.getElementById('manualInputSection').classList.remove('hidden');
            document.getElementById('ocrInputSection').classList.add('hidden');
        });
    }

    if (ocrEntryBox) {
        ocrEntryBox.addEventListener('click', () => {
            console.log('OCR entry box clicked!');
            document.getElementById('ocrInputSection').classList.remove('hidden');
            document.getElementById('manualInputSection').classList.add('hidden');
        });
    }

    if (addManualRecipeButton) {
        addManualRecipeButton.addEventListener('click', handleRecipeSubmit);
    }
    
    const addFileRecipeButton = document.getElementById('addFileRecipeButton');
    if (addFileRecipeButton) {
        addFileRecipeButton.addEventListener('click', handleFileUpload);
    }

    // Add listener for the "Save Changes" button in the edit modal
    const saveChangesButton = document.getElementById('saveChangesButton');
    if (saveChangesButton) {
        saveChangesButton.addEventListener('click', handleUpdateRecipe);
    }

    if (cancelEditButton) {
        cancelEditButton.addEventListener('click', () => {
             document.getElementById('edit-recipe-modal').classList.add('hidden');
        });
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

    // Manually gather data from input fields
    const recipeData = {
        itemName: document.getElementById('itemName').value,
        categories: document.getElementById('categories').value,
        description: document.getElementById('description').value,
        ingredients: document.getElementById('ingredients').value,
        instructions: document.getElementById('instructions').value,
        notes: document.getElementById('notes').value || ''
    };

    // Process raw text into arrays, filtering out empty lines/tags
    recipeData.categories = recipeData.categories.split(',').map(s => s.trim()).filter(Boolean);
    recipeData.ingredients = recipeData.ingredients.split('\n').map(s => s.trim()).filter(Boolean);
    recipeData.instructions = recipeData.instructions.split('\n').map(s => s.trim()).filter(Boolean);

    // Basic validation
    if (!recipeData.itemName || recipeData.ingredients.length === 0 || recipeData.instructions.length === 0) {
        displayErrorMessage('Recipe Name, Ingredients, and Instructions are required.');
        return;
    }

    try {
        showLoading('Saving recipe...');
        await addRecipe(recipeData);
        
        // Clear the form fields manually
        document.getElementById('itemName').value = '';
        document.getElementById('categories').value = '';
        document.getElementById('description').value = '';
        document.getElementById('ingredients').value = '';
        document.getElementById('instructions').value = '';
        document.getElementById('notes').value = '';

        // Hide the form
        document.getElementById('manualInputSection').classList.add('hidden');

    } catch (error) {
        // Log the error for debugging, even though recipes.js already displays a message.
        console.error('Error saving recipe:', error);
    } finally {
        hideLoading();
    }
}

/**
 * Handles the file upload for OCR or text processing.
 */
async function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        displayErrorMessage('Please select a file to upload.');
        return;
    }

    showLoading('Processing file, this may take a moment...');

    try {
        let text = '';
        if (file.type === 'text/plain') {
            text = await file.text();
        } else if (file.type.startsWith('image/')) {
            const { data } = await Tesseract.recognize(file, 'eng', {
                logger: m => console.log(`[OCR] ${m.status}: ${Math.round(m.progress * 100)}%`)
            });
            text = data.text;
        } else {
            throw new Error('Unsupported file type. Please use .txt, .jpg, or .png.');
        }

        const parsedData = parseRecipeText(text);
        populateManualForm(parsedData);

        // Switch view to the populated manual form for review
        document.getElementById('manualInputSection').classList.remove('hidden');
        document.getElementById('ocrInputSection').classList.add('hidden');
        displaySuccessMessage('Recipe data extracted! Please review and save.');

    } catch (error) {
        console.error('Error processing file:', error);
        displayErrorMessage(error.message || 'Failed to process file.');
    } finally {
        hideLoading();
        fileInput.value = ''; // Reset file input
    }
}

/**
 * A comprehensive parser to extract recipe parts from raw text.
 * Enhanced to handle complex recipes with multiple sections, timing info, and nutrition facts.
 * @param {string} text - The raw text from OCR or a .txt file.
 * @returns {Object} An object with itemName, description, ingredients, instructions, and notes.
 */
function parseRecipeText(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    if (lines.length === 0) return {};

    const recipe = {
        itemName: '',
        description: '',
        categories: [],
        ingredients: [],
        instructions: [],
        notes: ''
    };

    let currentSection = 'header';
    let foundTitle = false;
    let nutritionStarted = false;

    // Enhanced keywords for better section detection
    const keywords = {
        ingredients: ['ingredients'],
        instructions: ['instructions', 'directions', 'method', 'preparation', 'steps'],
        nutrition: ['nutrition facts', 'nutrition information', 'per serving', 'calories'],
        timing: ['prep time', 'total time', 'cook time', 'servings', 'serves', 'yield']
    };

    // Ingredient sub-section patterns (like "Peanut Sauce:", "Nuoc Cham:")
    const subSectionPattern = /^([A-Za-z\s]+):\s*$/;

    // For merging broken instruction lines
    let lastInstruction = '';
    let inInstructions = false;

    // Patterns to skip as non-title lines (site names, watermarks, etc.)
    const nonTitlePatterns = [
        /allrecipes/i,
        /alecipes/i,
        /food\.com/i,
        /epicurious/i,
        /tasty/i,
        /yummly/i,
        /test kitchen/i,
        /submitted by/i,
        /tested by/i,
        /recipe hub/i,
        /recipe of the day/i,
        /recipe(s)?!/i,
        /\bservings?\b/i,
        /\bminutes?\b/i,
        /\bcook time\b/i,
        /\bprep time\b/i,
        /\btotal time\b/i
    ];

    // Helper: Normalize unicode fractions to ASCII
    function normalizeFractions(str) {
        return str
            .replace(/½/g, '1/2')
            .replace(/⅓/g, '1/3')
            .replace(/⅔/g, '2/3')
            .replace(/¼/g, '1/4')
            .replace(/¾/g, '3/4')
            .replace(/⅕/g, '1/5')
            .replace(/⅖/g, '2/5')
            .replace(/⅗/g, '3/5')
            .replace(/⅘/g, '4/5')
            .replace(/⅙/g, '1/6')
            .replace(/⅚/g, '5/6')
            .replace(/⅛/g, '1/8')
            .replace(/⅜/g, '3/8')
            .replace(/⅝/g, '5/8')
            .replace(/⅞/g, '7/8')
            // Fix Tesseract OCR error: replace % with 1/2
            .replace(/(^|\s)%(?=\s|$)/g, '$11/2') // Standalone %
            .replace(/%/g, '1/2') // Any remaining %
            // Separate numbers and words stuck together (e.g., 1lemon -> 1 lemon)
            .replace(/(\d)([a-zA-Z])/g, '$1 $2')
            // Split common run-together English word pairs from OCR (case-insensitive)
            .replace(/\b[Ii]nafood\b/g, 'In a food')
            .replace(/\b[Ii]nthe\b/g, 'in the')
            .replace(/\b[Ii]ntoa\b/g, 'into a')
            .replace(/\b[Ii]ntothe\b/g, 'into the')
            .replace(/\b[Ii]n([aA])([A-Za-z]+)/g, 'In a $2') // e.g., Inapple → In a pple
            .replace(/\b([Oo]f|[Tt]o|[Oo]n|[Aa]t|[Bb]y|[Aa]n|[Aa])([A-Z][a-z]+)/g, '$1 $2') // e.g., Ontable → On table
            // General: split a short word (1-2 letters) from a following word if run together
            .replace(/\b([a-zA-Z]{1,2})([A-Z][a-z]+)/g, '$1 $2')
            // Aggressively split run-together words from OCR
            .replace(/([a-z])([A-Z])/g, '$1 $2') // e.g., 'Inafood' -> 'In a food'
            .replace(/([a-z])([ai])([a-z]+)/g, '$1 $2$3')
            // Fix common split ingredient words from OCR
            .replace(/t\s*a\s*s\s*p\s*o\s*o\s*n/gi, 'teaspoon')
            .replace(/t\s*b\s*s\s*p\s*o\s*o\s*n/gi, 'tablespoon')
            .replace(/b\s*a\s*k\s*i\s*n\s*g/gi, 'baking')
            .replace(/m\s*i\s*l\s*k/gi, 'milk')
            .replace(/a\s*a\s*l\s*l-?p\s*u\s*r\s*p\s*o\s*s\s*e/gi, 'all-purpose')
            .replace(/s\s*u\s*g\s*a\s*r/gi, 'sugar')
            .replace(/b\s*u\s*t\s*t\s*e\s*r/gi, 'butter')
            .replace(/e\s*g\s*g/gi, 'egg')
            .replace(/l\s*a\s*r\s*g\s*e/gi, 'large')
            .replace(/f\s*l\s*o\s*u\s*r/gi, 'flour')
            .replace(/p\s*o\s*w\s*d\s*e\s*r/gi, 'powder')
            .replace(/s\s*a\s*l\s*t/gi, 'salt')
            .replace(/m\s*e\s*l\s*t/gi, 'melt')
            .replace(/w\s*h\s*i\s*t\s*e/gi, 'white')
            .replace(/a\s*r\s*g\s*e\s*e\s*g\s*g/gi, 'large egg')
            .replace(/a\s*r\s*g\s*e\s*g\s*g/gi, 'large egg')
            .replace(/l\s*a\s*r\s*g\s*e\s*e\s*g\s*g/gi, 'large egg')
            .replace(/\s{2,}/g, ' '); // Remove extra spaces
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lowerLine = line.toLowerCase();
        let isNewSection = false;

        // Skip common OCR artifacts and formatting
        if (line.match(/^[•\-*–—]\s*$/) || line.length < 2) continue;

        // Detect main sections
        if (keywords.instructions.some(kw => lowerLine.includes(kw))) {
            currentSection = 'instructions';
            inInstructions = true;
            isNewSection = true;
        } else if (keywords.ingredients.some(kw => lowerLine.includes(kw))) {
            currentSection = 'ingredients';
            inInstructions = false;
            isNewSection = true;
        } else if (keywords.nutrition.some(kw => lowerLine.includes(kw))) {
            currentSection = 'nutrition';
            nutritionStarted = true;
            inInstructions = false;
            isNewSection = true;
        }

        if (isNewSection) continue;

        // Parse based on current section
        if (currentSection === 'header') {
            // First substantial line is usually the recipe title
            if (!foundTitle && line.length > 3) {
                // Skip lines that match non-title patterns or are only 1 word
                const isNonTitle = nonTitlePatterns.some((pat) => pat.test(line));
                const wordCount = line.split(/\s+/).length;
                if (!isNonTitle && wordCount > 1) {
                    recipe.itemName = line.replace(/^(recipe|dish):\s*/i, '').trim();
                    foundTitle = true;
                }
            } else if (foundTitle) {
                // Collect description and metadata
                if (keywords.timing.some(kw => lowerLine.includes(kw)) || 
                    lowerLine.includes('by ') || 
                    lowerLine.includes('tested by') ||
                    lowerLine.includes('servings') ||
                    lowerLine.includes('mins')) {
                    recipe.description += (recipe.description ? ' ' : '') + line;
                } else if (line.length > 10 && !line.includes(':')) {
                    // Likely a description paragraph
                    recipe.description += (recipe.description ? ' ' : '') + line;
                }
            }
        } else if (currentSection === 'ingredients') {
            // Handle ingredient sub-sections (like "Peanut Sauce:", "Nuoc Cham:")
            if (subSectionPattern.test(line)) {
                recipe.ingredients.push('');
                recipe.ingredients.push(`--- ${line.slice(0, -1)} ---`);
            } else {
                // Clean up common OCR artifacts and formatting
                let cleanedLine = line
                    .replace(/^[-•*–—•]\s*/, '') // Remove bullet points
                    .replace(/^\d+\.\s*/, '') // Remove numbering
                    .replace(/^Step\s*\d+[:\s]*/i, '') // Remove step indicators
                    .trim();
                // Normalize unicode fractions to ASCII
                cleanedLine = normalizeFractions(cleanedLine);
                if (cleanedLine && cleanedLine.length > 1) {
                    recipe.ingredients.push(cleanedLine);
                }
            }
        } else if (currentSection === 'instructions') {
            // Clean up instruction formatting
            let cleanedLine = line
                .replace(/^[-•*–—•]\s*/, '') // Remove bullets
                .replace(/^[0-9]+[.)]?\s*/, '') // Remove step numbers
                .replace(/^step\s*[0-9]+[:\s]*/i, '') // Remove "Step X" indicators
                .trim();

            // Ignore artifacts and single-word lines that are not real steps
            if (/^(stepa?|steps?)$/i.test(cleanedLine) || cleanedLine.length < 3) continue;
            if (/^nam choc\.?$/i.test(cleanedLine)) continue;

            // If the line starts with a quote or lowercase, or is a continuation, merge with previous
            if (recipe.instructions.length > 0 &&
                !/^([A-Z0-9]|\').*/.test(cleanedLine) &&
                cleanedLine.length > 0) {
                // Merge with previous instruction
                recipe.instructions[recipe.instructions.length - 1] += ' ' + cleanedLine;
            } else {
                recipe.instructions.push(cleanedLine);
            }
        } else if (currentSection === 'nutrition' || nutritionStarted) {
            // Append nutrition facts to notes
            recipe.notes += (recipe.notes ? '\n' : '') + line;
        }
    }

    // Post-processing cleanup
    recipe.itemName = recipe.itemName || 'Untitled Recipe';
    recipe.description = recipe.description.trim();
    
    // If we have nutrition info, format it better
    if (recipe.notes && recipe.notes.includes('calorie')) {
        recipe.notes = 'Nutrition Facts:\n' + recipe.notes;
    }

    // Extract categories from description if present
    const categoryKeywords = ['italian', 'asian', 'vietnamese', 'chinese', 'mexican', 'indian', 'thai', 
                             'dinner', 'lunch', 'breakfast', 'appetizer', 'dessert', 'soup', 'salad',
                             'healthy', 'vegetarian', 'vegan', 'gluten-free', 'low-carb'];
    
    const descLower = recipe.description.toLowerCase();
    categoryKeywords.forEach(keyword => {
        if (descLower.includes(keyword)) {
            const capitalizedKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1);
            if (!recipe.categories.includes(capitalizedKeyword)) {
                recipe.categories.push(capitalizedKeyword);
            }
        }
    });

    console.log('Parsed recipe data:', recipe);
    return recipe;
}

/**
 * Populates the manual entry form with parsed recipe data.
 * @param {Object} data - The parsed recipe data.
 */
function populateManualForm(data) {
    document.getElementById('itemName').value = data.itemName || '';
    document.getElementById('categories').value = (data.categories || []).join(', ');
    document.getElementById('description').value = data.description || '';
    document.getElementById('ingredients').value = (data.ingredients || []).join('\n');
    document.getElementById('instructions').value = (data.instructions || []).join('\n');
    
    // Add notes section content if available (like nutrition facts)
    const notesTextarea = document.getElementById('notes');
    if (notesTextarea && data.notes) {
        notesTextarea.value = data.notes;
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

/**
 * Open the edit recipe modal and populate it with the recipe data
 * @param {Object} recipe - Recipe data to populate the modal
 */
export function openEditModal(recipe) {
    const modal = document.getElementById('edit-recipe-modal');
    if (!modal) return;

    // Populate modal fields (adjust IDs as needed)
    document.getElementById('editItemName').value = recipe.itemName || '';
    document.getElementById('editCategories').value = (recipe.categories || []).join(', ');
    document.getElementById('editDescription').value = recipe.description || '';
    document.getElementById('editIngredients').value = (recipe.ingredients || []).join('\n');
    document.getElementById('editInstructions').value = (recipe.instructions || []).join('\n');
    document.getElementById('editNotes').value = recipe.notes || '';
    
    // Store the ID of the recipe being edited
    editingRecipeId = recipe.id;

    // Show the modal (remove hidden class)
    modal.classList.remove('hidden');
    // For mobile: scroll modal into view
    setTimeout(() => {
        modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    // Optionally, focus the first input for better mobile UX
    document.getElementById('editItemName').focus();
}

/**
 * Handles updating a recipe from the edit modal.
 */
async function handleUpdateRecipe() {
    if (!editingRecipeId) {
        displayErrorMessage('No recipe selected for editing.');
        return;
    }

    const updatedData = {
        itemName: document.getElementById('editItemName').value,
        categories: document.getElementById('editCategories').value.split(',').map(s => s.trim()).filter(Boolean),
        description: document.getElementById('editDescription').value,
        ingredients: document.getElementById('editIngredients').value.split('\n').map(s => s.trim()).filter(Boolean),
        instructions: document.getElementById('editInstructions').value.split('\n').map(s => s.trim()).filter(Boolean),
        notes: document.getElementById('editNotes').value
    };

    // Basic validation
    if (!updatedData.itemName || updatedData.ingredients.length === 0 || updatedData.instructions.length === 0) {
        displayErrorMessage('Recipe Name, Ingredients, and Instructions are required.');
        return;
    }

    try {
        showLoading('Updating recipe...');
        await updateRecipe(editingRecipeId, updatedData);
        document.getElementById('edit-recipe-modal').classList.add('hidden');
        editingRecipeId = null; // Reset after update
    } catch (error) {
        console.error('Error updating recipe:', error);
        // Error message is already displayed by updateRecipe
    } finally {
        hideLoading();
    }
}