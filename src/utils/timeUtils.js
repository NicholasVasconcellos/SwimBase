/**
 * Convert time in seconds to formatted string (xx:xx.xxx or xx.xxx)
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "--";

  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(3);
    return `${mins}:${secs.padStart(6, "0")}`;
  }
  return seconds.toFixed(3);
};

/**
 * Parse time input string to seconds
 * @param {string} input - Time string (e.g., "25.340" or "1:03.450")
 * @returns {number|null} Time in seconds or null if invalid
 */
export const parseTimeInput = (input) => {
  if (!input) return null;

  if (input.includes(":")) {
    const [mins, secs] = input.split(":");
    return parseFloat(mins) * 60 + parseFloat(secs);
  }
  return parseFloat(input);
};

/**
 * Calculate result time based on best time and effort percentage
 * @param {number} bestSeconds - Best time in seconds
 * @param {number} effortPercent - Effort as decimal (e.g., 0.8 for 80%)
 * @returns {number|null} Result time in seconds or null if invalid
 */
export const calculateResultTime = (bestSeconds, effortPercent) => {
  if (bestSeconds == null || isNaN(bestSeconds)) return null;
  return bestSeconds + bestSeconds * (1 - effortPercent);
};
