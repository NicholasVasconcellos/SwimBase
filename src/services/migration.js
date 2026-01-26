import {
  STORAGE_KEYS,
  loadEntities,
  saveEntities,
  getValue,
  setValue,
  generateId,
} from "./storage";

const CURRENT_MIGRATION_VERSION = "1";

/**
 * Maps stroke names to stroke entity IDs
 * @param {Array} strokes - Stroke entities
 * @returns {Object} name -> id mapping
 */
const buildStrokeMap = (strokes) => {
  const map = {};
  strokes.forEach((stroke) => {
    map[stroke.name.toLowerCase()] = stroke.id;
  });
  return map;
};

/**
 * Extracts unique swimmer names from legacy entries
 * @param {Array} entries - Legacy swim entries
 * @returns {Array} Unique names
 */
const extractUniqueSwimmers = (entries) => {
  const names = new Set();
  entries.forEach((entry) => {
    if (entry.name && entry.name.trim()) {
      names.add(entry.name.trim());
    }
  });
  return Array.from(names);
};

/**
 * Converts legacy entries to new Time entities
 * @param {Array} entries - Legacy entries
 * @param {Object} swimmerMap - name -> swimmer entity mapping
 * @param {Object} strokeMap - stroke name -> stroke id mapping
 * @returns {Array} Time entities
 */
const convertEntriesToTimes = (entries, swimmerMap, strokeMap) => {
  return entries
    .map((entry) => {
      const swimmer = swimmerMap[entry.name?.toLowerCase()];
      const strokeId = strokeMap[entry.stroke?.toLowerCase()];

      if (!swimmer || !strokeId) return null;

      return {
        id: generateId(),
        swimmerId: swimmer.id,
        strokeId,
        distance: entry.distance,
        timeSeconds: entry.bestSeconds || 0,
        resultSeconds: entry.resultSeconds,
        effort: entry.effort,
        date: entry.timestamp || new Date().toISOString(),
        createdAt: entry.id || Date.now(),
        legacyId: entry.id,
      };
    })
    .filter(Boolean);
};

/**
 * Migrates legacy swimEntries to new entity format
 * @param {Array} legacyEntries - Old format entries
 * @param {Array} existingStrokes - Current stroke entities
 * @returns {Object} { swimmers, times } - Migrated entities
 */
export const migrateLegacyEntries = (legacyEntries, existingStrokes) => {
  if (!legacyEntries || legacyEntries.length === 0) {
    return { swimmers: [], times: [] };
  }

  // Build stroke mapping
  const strokeMap = buildStrokeMap(existingStrokes);

  // Extract and create swimmer entities
  const swimmerNames = extractUniqueSwimmers(legacyEntries);
  const swimmers = swimmerNames.map((name) => ({
    id: generateId(),
    name,
    teamIds: [],
    groupIds: [],
    createdAt: Date.now(),
  }));

  // Build swimmer name -> entity mapping
  const swimmerMap = {};
  swimmers.forEach((s) => {
    swimmerMap[s.name.toLowerCase()] = s;
  });

  // Convert entries to times
  const times = convertEntriesToTimes(legacyEntries, swimmerMap, strokeMap);

  return { swimmers, times };
};

/**
 * Checks if migration is needed and runs it
 * @returns {Promise<boolean>} True if migration ran
 */
export const runMigrationIfNeeded = async () => {
  try {
    const version = await getValue(STORAGE_KEYS.MIGRATION_VERSION);

    if (version === CURRENT_MIGRATION_VERSION) {
      return false;
    }

    // Load legacy entries
    const legacyEntries = await loadEntities(STORAGE_KEYS.LEGACY_ENTRIES);
    if (legacyEntries.length === 0) {
      // No legacy data, just mark as migrated
      await setValue(STORAGE_KEYS.MIGRATION_VERSION, CURRENT_MIGRATION_VERSION);
      return false;
    }

    // Load or seed strokes first
    let strokes = await loadEntities(STORAGE_KEYS.STROKES);
    if (strokes.length === 0) {
      // Seed default strokes
      strokes = [
        { id: generateId(), name: "Freestyle" },
        { id: generateId(), name: "Backstroke" },
        { id: generateId(), name: "Breaststroke" },
        { id: generateId(), name: "Butterfly" },
        { id: generateId(), name: "Individual Medley" },
      ];
      await saveEntities(STORAGE_KEYS.STROKES, strokes);
    }

    // Run migration
    const { swimmers, times } = migrateLegacyEntries(legacyEntries, strokes);

    // Save migrated entities
    if (swimmers.length > 0) {
      const existingSwimmers = await loadEntities(STORAGE_KEYS.SWIMMERS);
      await saveEntities(STORAGE_KEYS.SWIMMERS, [
        ...swimmers,
        ...existingSwimmers,
      ]);
    }

    if (times.length > 0) {
      const existingTimes = await loadEntities(STORAGE_KEYS.TIMES);
      await saveEntities(STORAGE_KEYS.TIMES, [...times, ...existingTimes]);
    }

    // Mark migration complete
    await setValue(STORAGE_KEYS.MIGRATION_VERSION, CURRENT_MIGRATION_VERSION);

    console.log(
      `Migration complete: ${swimmers.length} swimmers, ${times.length} times`
    );
    return true;
  } catch (error) {
    console.log("Migration error:", error);
    return false;
  }
};

/**
 * Gets current migration version
 * @returns {Promise<string|null>}
 */
export const getMigrationVersion = async () => {
  return getValue(STORAGE_KEYS.MIGRATION_VERSION);
};
