/**
 * Get numeric distance value from string (strips unit suffix)
 * @param {string|number} distance - Distance with optional unit (e.g., "100m", "50y")
 * @returns {string} Distance without unit suffix
 */
export const getDistanceValue = (distance) => {
  if (!distance) return distance;
  return distance.toString().replace(/[my]$/i, "");
};
