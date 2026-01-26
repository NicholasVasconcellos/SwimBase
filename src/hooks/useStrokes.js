import { useEntityStore } from "./useEntityStore";
import { STORAGE_KEYS } from "../services/storage";

/**
 * Default strokes seeded on first launch
 */
const DEFAULT_STROKES = [
  { name: "Freestyle" },
  { name: "Backstroke" },
  { name: "Breaststroke" },
  { name: "Butterfly" },
  { name: "Individual Medley" },
];

/**
 * Validates stroke entity
 * @param {Object} stroke
 * @returns {boolean}
 */
const validateStroke = (stroke) => {
  return stroke && typeof stroke.name === "string" && stroke.name.trim() !== "";
};

/**
 * Hook for managing stroke entities
 * @returns {Object} Stroke state and CRUD operations
 */
export const useStrokes = () => {
  const store = useEntityStore(STORAGE_KEYS.STROKES, {
    validate: validateStroke,
    initialData: DEFAULT_STROKES,
  });

  return {
    strokes: store.entities,
    isLoading: store.isLoading,
    addStroke: store.add,
    updateStroke: store.update,
    removeStroke: store.remove,
    getStrokeById: store.getById,
    reloadStrokes: store.reload,
  };
};
