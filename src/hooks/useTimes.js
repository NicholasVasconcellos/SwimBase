import { useCallback } from "react";
import { useEntityStore } from "./useEntityStore";
import { STORAGE_KEYS } from "../services/storage";

/**
 * Validates time entity
 * @param {Object} time
 * @returns {boolean}
 */
const validateTime = (time) => {
  return (
    time &&
    time.swimmerId &&
    time.strokeId &&
    typeof time.distance === "string" &&
    typeof time.timeSeconds === "number" &&
    !isNaN(time.timeSeconds)
  );
};

/**
 * Hook for managing time entities
 * @returns {Object} Time state and CRUD operations
 */
export const useTimes = () => {
  const store = useEntityStore(STORAGE_KEYS.TIMES, {
    validate: validateTime,
  });

  /**
   * Gets times for a specific swimmer
   * @param {string} swimmerId
   * @returns {Array}
   */
  const getTimesBySwimmer = useCallback(
    (swimmerId) => {
      return store.entities.filter((t) => t.swimmerId === swimmerId);
    },
    [store.entities]
  );

  /**
   * Gets times for a specific stroke
   * @param {string} strokeId
   * @returns {Array}
   */
  const getTimesByStroke = useCallback(
    (strokeId) => {
      return store.entities.filter((t) => t.strokeId === strokeId);
    },
    [store.entities]
  );

  /**
   * Gets best time for swimmer/stroke/distance combo
   * @param {string} swimmerId
   * @param {string} strokeId
   * @param {string} distance
   * @returns {Object|undefined}
   */
  const getBestTime = useCallback(
    (swimmerId, strokeId, distance) => {
      const matching = store.entities.filter(
        (t) =>
          t.swimmerId === swimmerId &&
          t.strokeId === strokeId &&
          t.distance === distance
      );
      if (matching.length === 0) return undefined;
      return matching.reduce((best, current) =>
        current.timeSeconds < best.timeSeconds ? current : best
      );
    },
    [store.entities]
  );

  return {
    times: store.entities,
    isLoading: store.isLoading,
    addTime: store.add,
    updateTime: store.update,
    removeTime: store.remove,
    getTimeById: store.getById,
    getTimesBySwimmer,
    getTimesByStroke,
    getBestTime,
    reloadTimes: store.reload,
    clearTimes: store.clear,
    bulkInsertTimes: store.bulkInsert,
    timeCount: store.count,
  };
};
