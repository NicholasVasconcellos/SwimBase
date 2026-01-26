import { useEntityStore } from "./useEntityStore";
import { STORAGE_KEYS } from "../services/storage";

/**
 * Validates team entity
 * @param {Object} team
 * @returns {boolean}
 */
const validateTeam = (team) => {
  return team && typeof team.name === "string" && team.name.trim() !== "";
};

/**
 * Hook for managing team entities
 * @returns {Object} Team state and CRUD operations
 */
export const useTeams = () => {
  const store = useEntityStore(STORAGE_KEYS.TEAMS, {
    validate: validateTeam,
  });

  return {
    teams: store.entities,
    isLoading: store.isLoading,
    addTeam: store.add,
    updateTeam: store.update,
    removeTeam: store.remove,
    getTeamById: store.getById,
    reloadTeams: store.reload,
  };
};
