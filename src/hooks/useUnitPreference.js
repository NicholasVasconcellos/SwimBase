import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "unitPreference";

/**
 * Custom hook for managing distance unit preference (meters/yards)
 * @returns {Object} Unit state and setter
 */
export const useUnitPreference = () => {
  // Create 2 variables with state Hook
  const [unit, setUnit] = useState("m"); // 'm' for meters, 'y' for yards
  const [isLoading, setIsLoading] = useState(true);

  // Use Effect Hook: run once on Mount, to load the unit
  useEffect(() => {
    loadUnit();
  }, []);

  // Trigger reload When unit changes or loading changes, set the new value to storage
  useEffect(() => {
    if (!isLoading) {
      saveUnit(unit);
    }
  }, [unit, isLoading]);


  /**
   * Loads saved unit preference from AsyncStorage into state
   */
  const loadUnit = async () => {
    // try to laod from storage
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUnit(saved);
      }
    } catch (error) {
      console.log("Error loading unit preference:", error);
    } finally {
      // Once complete set Finished loading
      setIsLoading(false);
    }
  };

  /**
   * Persists unit preference to AsyncStorage
   * @param {string} unitValue - Unit to save ('m' or 'y')
   */
  const saveUnit = async (unitValue) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, unitValue);
    } catch (error) {
      console.log("Error saving unit preference:", error);
    }
  };

  // Return the unit, the setter, and the booleans
  return {
    unit,
    setUnit,
    isMeters: unit === "m",
    isYards: unit === "y",
    isLoading,
  };
};
