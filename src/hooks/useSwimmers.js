import { useCallback } from "react";
import { useEntityStore } from "./useEntityStore";
import { STORAGE_KEYS } from "../services/storage";

/**
 * Validates swimmer entity
 * @param {Object} swimmer
 * @returns {boolean}
 */
const validateSwimmer = (swimmer) => {
  return (
    swimmer && typeof swimmer.name === "string" && swimmer.name.trim() !== ""
  );
};

/**
 * Hook for managing swimmer entities
 * @returns {Object} Swimmer state and CRUD operations
 */
export const useSwimmers = () => {
  const store = useEntityStore(STORAGE_KEYS.SWIMMERS, {
    validate: validateSwimmer,
  });

  /**
   * Gets swimmers belonging to a specific team
   * @param {string} teamId
   * @returns {Array}
   */
  const getSwimmersByTeam = useCallback(
    (teamId) => {
      return store.entities.filter(
        (s) => s.teamIds && s.teamIds.includes(teamId)
      );
    },
    [store.entities]
  );

  /**
   * Gets swimmers belonging to a specific group
   * @param {string} groupId
   * @returns {Array}
   */
  const getSwimmersByGroup = useCallback(
    (groupId) => {
      return store.entities.filter(
        (s) => s.groupIds && s.groupIds.includes(groupId)
      );
    },
    [store.entities]
  );

  /**
   * Finds swimmer by name (case-insensitive)
   * @param {string} name
   * @returns {Object|undefined}
   */
  const getSwimmerByName = useCallback(
    (name) => {
      const lower = name.toLowerCase();
      return store.entities.find((s) => s.name.toLowerCase() === lower);
    },
    [store.entities]
  );

  return {
    swimmers: store.entities,
    isLoading: store.isLoading,
    addSwimmer: store.add,
    updateSwimmer: store.update,
    removeSwimmer: store.remove,
    getSwimmerById: store.getById,
    getSwimmerByName,
    getSwimmersByTeam,
    getSwimmersByGroup,
    reloadSwimmers: store.reload,
    bulkInsertSwimmers: store.bulkInsert,
  };
};
