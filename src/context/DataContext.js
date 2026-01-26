import React, { createContext, useContext, useEffect, useState } from "react";
import { useTeams } from "../hooks/useTeams";
import { useGroups } from "../hooks/useGroups";
import { useStrokes } from "../hooks/useStrokes";
import { useSwimmers } from "../hooks/useSwimmers";
import { useTimes } from "../hooks/useTimes";
import { useTrainings } from "../hooks/useTrainings";
import { runMigrationIfNeeded } from "../services/migration";

const DataContext = createContext(null);

/**
 * Context provider that manages all entity state throughout the app
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const DataProvider = ({ children }) => {
  const [migrationComplete, setMigrationComplete] = useState(false);

  const teams = useTeams();
  const groups = useGroups();
  const strokes = useStrokes();
  const swimmers = useSwimmers();
  const times = useTimes();
  const trainings = useTrainings();

  // Run migration on mount
  useEffect(() => {
    const migrate = async () => {
      await runMigrationIfNeeded();
      setMigrationComplete(true);
    };
    migrate();
  }, []);

  const isLoading =
    !migrationComplete ||
    teams.isLoading ||
    groups.isLoading ||
    strokes.isLoading ||
    swimmers.isLoading ||
    times.isLoading ||
    trainings.isLoading;

  const value = {
    // Entity collections
    teams,
    groups,
    strokes,
    swimmers,
    times,
    trainings,
    // Global state
    isLoading,
    migrationComplete,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

/**
 * Hook to access all entity data
 * @returns {Object} All entity hooks and state
 */
export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
