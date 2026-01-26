import { useCallback } from "react";
import { useEntityStore } from "./useEntityStore";
import { STORAGE_KEYS } from "../services/storage";

/**
 * Validates group entity
 * @param {Object} group
 * @returns {boolean}
 */
const validateGroup = (group) => {
  return group && typeof group.name === "string" && group.name.trim() !== "";
};

/**
 * Hook for managing group entities
 * @returns {Object} Group state and CRUD operations
 */
export const useGroups = () => {
  const store = useEntityStore(STORAGE_KEYS.GROUPS, {
    validate: validateGroup,
  });

  /**
   * Gets groups belonging to a specific team
   * @param {string} teamId
   * @returns {Array}
   */
  const getGroupsByTeam = useCallback(
    (teamId) => {
      return store.entities.filter((g) => g.teamId === teamId);
    },
    [store.entities]
  );

  return {
    groups: store.entities,
    isLoading: store.isLoading,
    addGroup: store.add,
    updateGroup: store.update,
    removeGroup: store.remove,
    getGroupById: store.getById,
    getGroupsByTeam,
    reloadGroups: store.reload,
  };
};
