import { useCallback } from "react";
import { useEntityStore } from "./useEntityStore";
import { STORAGE_KEYS } from "../services/storage";

/**
 * Validates training entity
 * @param {Object} training
 * @returns {boolean}
 */
const validateTraining = (training) => {
  return (
    training &&
    typeof training.name === "string" &&
    training.name.trim() !== ""
  );
};

/**
 * Hook for managing training entities with embedded exercises
 * @returns {Object} Training state and CRUD operations
 */
export const useTrainings = () => {
  const store = useEntityStore(STORAGE_KEYS.TRAININGS, {
    validate: validateTraining,
  });

  /**
   * Adds exercise to a training
   * @param {string} trainingId
   * @param {Object} exercise
   * @returns {Promise<Object|null>}
   */
  const addExercise = useCallback(
    async (trainingId, exercise) => {
      const training = store.getById(trainingId);
      if (!training) return null;

      const exercises = training.exercises || [];
      const newExercise = {
        ...exercise,
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      return store.update(trainingId, {
        exercises: [...exercises, newExercise],
      });
    },
    [store]
  );

  /**
   * Updates exercise in a training
   * @param {string} trainingId
   * @param {string} exerciseId
   * @param {Object} updates
   * @returns {Promise<Object|null>}
   */
  const updateExercise = useCallback(
    async (trainingId, exerciseId, updates) => {
      const training = store.getById(trainingId);
      if (!training) return null;

      const exercises = (training.exercises || []).map((ex) =>
        ex.id === exerciseId ? { ...ex, ...updates } : ex
      );

      return store.update(trainingId, { exercises });
    },
    [store]
  );

  /**
   * Removes exercise from a training
   * @param {string} trainingId
   * @param {string} exerciseId
   * @returns {Promise<Object|null>}
   */
  const removeExercise = useCallback(
    async (trainingId, exerciseId) => {
      const training = store.getById(trainingId);
      if (!training) return null;

      const exercises = (training.exercises || []).filter(
        (ex) => ex.id !== exerciseId
      );

      return store.update(trainingId, { exercises });
    },
    [store]
  );

  return {
    trainings: store.entities,
    isLoading: store.isLoading,
    addTraining: store.add,
    updateTraining: store.update,
    removeTraining: store.remove,
    getTrainingById: store.getById,
    addExercise,
    updateExercise,
    removeExercise,
    reloadTrainings: store.reload,
  };
};
