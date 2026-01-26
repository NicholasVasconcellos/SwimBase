import React, { createContext, useContext } from "react";
import { useEntries } from "../hooks/useEntries";

const EntriesContext = createContext(null);

/**
 * Context provider that manages swim entries state throughout the app
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The context provider
 */
export const EntriesProvider = ({ children }) => {
  const entriesState = useEntries();

  return (
    <EntriesContext.Provider value={entriesState}>
      {children}
    </EntriesContext.Provider>
  );
};

/**
 * Hook to access entries context for reading and modifying swim entries
 * @returns {Object} Entries state and operations
 * @throws {Error} If used outside of EntriesProvider
 */
export const useEntriesContext = () => {
  const context = useContext(EntriesContext);
  if (!context) {
    throw new Error("useEntriesContext must be used within an EntriesProvider");
  }
  return context;
};
