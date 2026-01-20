import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "unitPreference";

/**
 * Custom hook for managing distance unit preference (meters/yards)
 * @returns {Object} Unit state and setter
 */
export const useUnitPreference = () => {
  const [unit, setUnit] = useState("m"); // 'm' for meters, 'y' for yards
  const [isLoading, setIsLoading] = useState(true);

  // Load unit preference on mount
  useEffect(() => {
    loadUnit();
  }, []);

  // Save unit when it changes
  useEffect(() => {
    if (!isLoading) {
      saveUnit(unit);
    }
  }, [unit, isLoading]);

  const loadUnit = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUnit(saved);
      }
    } catch (error) {
      console.log("Error loading unit preference:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUnit = async (unitValue) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, unitValue);
    } catch (error) {
      console.log("Error saving unit preference:", error);
    }
  };

  return {
    unit,
    setUnit,
    isMeters: unit === "m",
    isYards: unit === "y",
    isLoading,
  };
};
