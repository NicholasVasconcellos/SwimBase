import { useState, useEffect, useCallback } from "react";
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatTime, parseTimeInput } from "../utils/timeUtils";

const STORAGE_KEY = "swimEntries";

/**
 * Custom hook for managing swim entries with AsyncStorage persistence
 * @returns {Object} Entries state and CRUD operations
 */
export const useEntries = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load entries on mount
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setEntries(JSON.parse(saved));
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.log("Error loading entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveEntries = async (newEntries) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
    } catch (error) {
      console.log("Error saving entries:", error);
    }
  };

  const addEntry = useCallback(
    async ({ name, stroke, distance, effort, bestTimeInput }) => {
      // Validation
      if (!name || !stroke || !distance || !bestTimeInput) {
        if (Platform.OS === "web") {
          window.alert("Please fill in all fields");
        } else {
          Alert.alert("Missing Fields", "Please fill in all fields");
        }
        return false;
      }

      const bestSeconds = parseTimeInput(bestTimeInput);
      if (bestSeconds == null || isNaN(bestSeconds)) {
        if (Platform.OS === "web") {
          window.alert("Please enter a valid time (e.g., 25.340 or 1:03.450)");
        } else {
          Alert.alert(
            "Invalid Best Time",
            "Please enter a valid time (e.g., 25.340 or 1:03.450)"
          );
        }
        return false;
      }

      const effortPercent = (parseInt(effort) || 80) / 100;
      const resultSeconds = bestSeconds + bestSeconds * (1 - effortPercent);

      const newEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        name,
        stroke,
        distance,
        effort,
        bestTime: formatTime(bestSeconds),
        resultTime: formatTime(resultSeconds),
        bestSeconds,
        resultSeconds,
      };

      const newEntries = [newEntry, ...entries];
      setEntries(newEntries);
      await saveEntries(newEntries);

      if (Platform.OS === "web") {
        window.alert("Entry logged!");
      } else {
        Alert.alert("Success", "Entry logged!");
      }

      return true;
    },
    [entries]
  );

  const clearEntries = useCallback(async () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to delete all entries?"
      );
      if (confirmed) {
        try {
          setEntries([]);
          await saveEntries([]);
          window.alert("All entries cleared!");
        } catch (error) {
          window.alert("Failed to clear entries: " + error.message);
        }
      }
    } else {
      Alert.alert(
        "Clear Log",
        "Are you sure you want to delete all entries?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete All",
            style: "destructive",
            onPress: async () => {
              try {
                setEntries([]);
                await saveEntries([]);
                Alert.alert("Success", "All entries cleared!");
              } catch (error) {
                Alert.alert(
                  "Error",
                  "Failed to clear entries: " + error.message
                );
              }
            },
          },
        ],
        { cancelable: true }
      );
    }
  }, []);

  return {
    entries,
    isLoading,
    addEntry,
    clearEntries,
    entryCount: entries.length,
  };
};
