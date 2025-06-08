// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAX1F4gzD0-nsAbj7yhSaJZxcwvWNRVFus",
    authDomain: "kelly-s-kuisine.firebaseapp.com",
    projectId: "kelly-s-kuisine",
    storageBucket: "kelly-s-kuisine.firebasestorage.app",
    messagingSenderId: "974729459966",
    appId: "1:974729459966:web:42bad27bd106242bfc0daf",
    measurementId: "G-CGY3C6F1Q2"
};

// Application ID
const appId = "1:974729459966:web:42bad27bd106242bfc0daf";

// Firebase collection paths
export const COLLECTIONS = {
    RECIPES: 'recipes',
    USERS: 'users'
};

// Application constants
export const APP_CONSTANTS = {
    SEARCH_DEBOUNCE_MS: 300,
    MESSAGE_TIMEOUT_MS: 5000,
    MAX_RECIPE_NAME_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 500,
    MAX_INGREDIENTS_LENGTH: 2000,
    MAX_INSTRUCTIONS_LENGTH: 5000,
    MAX_NOTES_LENGTH: 1000
};

// Validation rules
export const VALIDATION_RULES = {
    RECIPE_NAME: {
        required: true,
        maxLength: APP_CONSTANTS.MAX_RECIPE_NAME_LENGTH
    },
    DESCRIPTION: {
        required: false,
        maxLength: APP_CONSTANTS.MAX_DESCRIPTION_LENGTH
    },
    INGREDIENTS: {
        required: true,
        maxLength: APP_CONSTANTS.MAX_INGREDIENTS_LENGTH
    },
    INSTRUCTIONS: {
        required: true,
        maxLength: APP_CONSTANTS.MAX_INSTRUCTIONS_LENGTH
    },
    NOTES: {
        required: false,
        maxLength: APP_CONSTANTS.MAX_NOTES_LENGTH
    }
};

// Export the Firebase configuration
export { firebaseConfig, appId };