// Load environment variables
const env = import.meta.env;

// Firebase configuration
export const firebaseConfig = {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID
};

// Application ID
export const appId = env.VITE_APP_ID || 'default-recipe-app';

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