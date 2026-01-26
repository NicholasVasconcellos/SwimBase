import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Storage keys for all entity types
 */
export const STORAGE_KEYS = {
  TEAMS: "teams",
  GROUPS: "groups",
  STROKES: "strokes",
  SWIMMERS: "swimmers",
  TIMES: "times",
  TRAININGS: "trainings",
  LEGACY_ENTRIES: "swimEntries",
  MIGRATION_VERSION: "migrationVersion",
};

/**
 * Loads entities from AsyncStorage
 * @param {string} key - Storage key
 * @returns {Promise<Array>} Parsed entities or empty array
 */
export const loadEntities = async (key) => {
  try {
    const saved = await AsyncStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.log(`Error loading ${key}:`, error);
    return [];
  }
};

/**
 * Saves entities to AsyncStorage
 * @param {string} key - Storage key
 * @param {Array} data - Entities to persist
 */
export const saveEntities = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log(`Error saving ${key}:`, error);
  }
};

/**
 * Generates unique ID using timestamp + random suffix
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Gets a single value from AsyncStorage
 * @param {string} key - Storage key
 * @returns {Promise<string|null>}
 */
export const getValue = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.log(`Error getting ${key}:`, error);
    return null;
  }
};

/**
 * Sets a single value in AsyncStorage
 * @param {string} key - Storage key
 * @param {string} value - Value to store
 */
export const setValue = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(`Error setting ${key}:`, error);
  }
};

/**
 * Removes a key from AsyncStorage
 * @param {string} key - Storage key
 */
export const removeValue = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(`Error removing ${key}:`, error);
  }
};
