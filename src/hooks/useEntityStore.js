import { useState, useEffect, useCallback } from "react";
import { loadEntities, saveEntities, generateId } from "../services/storage";

/**
 * Factory hook for entity CRUD operations with persistence
 * @param {string} storageKey - AsyncStorage key for this entity type
 * @param {Object} options - Configuration options
 * @param {Function} options.validate - Optional validation function
 * @param {Array} options.initialData - Default data for first launch
 * @returns {Object} Entity state and CRUD operations
 */
export const useEntityStore = (storageKey, options = {}) => {
  const { validate, initialData = [] } = options;
  const [entities, setEntities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load entities on mount
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Loads entities from storage, seeds initial data if empty
   */
  const loadData = async () => {
    try {
      const saved = await loadEntities(storageKey);
      if (saved.length === 0 && initialData.length > 0) {
        // Seed initial data on first launch
        const seeded = initialData.map((item) => ({
          ...item,
          id: item.id || generateId(),
        }));
        await saveEntities(storageKey, seeded);
        setEntities(seeded);
      } else {
        setEntities(saved);
      }
      setIsInitialized(true);
    } catch (error) {
      console.log(`Error loading ${storageKey}:`, error);
      setEntities([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reloads entities from storage
   */
  const reload = useCallback(async () => {
    setIsLoading(true);
    await loadData();
  }, [storageKey]);

  /**
   * Adds a new entity
   * @param {Object} data - Entity data (id generated automatically)
   * @returns {Object|null} Created entity or null if validation fails
   */
  const add = useCallback(
    async (data) => {
      if (validate && !validate(data)) {
        return null;
      }
      const newEntity = {
        ...data,
        id: generateId(),
        createdAt: Date.now(),
      };
      const updated = [newEntity, ...entities];
      setEntities(updated);
      await saveEntities(storageKey, updated);
      return newEntity;
    },
    [entities, storageKey, validate]
  );

  /**
   * Updates an existing entity by ID
   * @param {string} id - Entity ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated entity or null if not found
   */
  const update = useCallback(
    async (id, updates) => {
      const index = entities.findIndex((e) => e.id === id);
      if (index === -1) return null;

      const merged = { ...entities[index], ...updates, updatedAt: Date.now() };
      if (validate && !validate(merged)) {
        return null;
      }

      const updated = [...entities];
      updated[index] = merged;
      setEntities(updated);
      await saveEntities(storageKey, updated);
      return merged;
    },
    [entities, storageKey, validate]
  );

  /**
   * Removes an entity by ID
   * @param {string} id - Entity ID
   * @returns {boolean} True if removed
   */
  const remove = useCallback(
    async (id) => {
      const filtered = entities.filter((e) => e.id !== id);
      if (filtered.length === entities.length) return false;

      setEntities(filtered);
      await saveEntities(storageKey, filtered);
      return true;
    },
    [entities, storageKey]
  );

  /**
   * Gets entity by ID
   * @param {string} id - Entity ID
   * @returns {Object|undefined}
   */
  const getById = useCallback(
    (id) => {
      return entities.find((e) => e.id === id);
    },
    [entities]
  );

  /**
   * Clears all entities
   */
  const clear = useCallback(async () => {
    setEntities([]);
    await saveEntities(storageKey, []);
  }, [storageKey]);

  /**
   * Bulk inserts entities (for migration)
   * @param {Array} items - Entities to insert
   */
  const bulkInsert = useCallback(
    async (items) => {
      const newItems = items.map((item) => ({
        ...item,
        id: item.id || generateId(),
        createdAt: item.createdAt || Date.now(),
      }));
      const updated = [...newItems, ...entities];
      setEntities(updated);
      await saveEntities(storageKey, updated);
      return newItems;
    },
    [entities, storageKey]
  );

  return {
    entities,
    isLoading,
    isInitialized,
    add,
    update,
    remove,
    getById,
    reload,
    clear,
    bulkInsert,
    count: entities.length,
  };
};
