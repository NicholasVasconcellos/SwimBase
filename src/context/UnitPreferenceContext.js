import React, { createContext, useContext } from "react";
import { useUnitPreference } from "../hooks/useUnitPreference";

// Make UnitPreference available globally, intially null
const UnitPreferenceContext = createContext(null);

/**
 * Context provider that manages distance unit preference (meters/yards)
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The context provider
 */
export const UnitPreferenceProvider = ({ children }) => {
  // Get's the Unit state and setter as object
  const unitState = useUnitPreference();

  // Return the object from context
  return (
    <UnitPreferenceContext.Provider value={unitState}>
      {children}
    </UnitPreferenceContext.Provider>
  );
};

/**
 * Hook to access unit preference context for reading and setting distance unit
 * @returns {Object} Unit state and setter
 * @throws {Error} If used outside of UnitPreferenceProvider
 */
export const useUnitPreferenceContext = () => {
  const context = useContext(UnitPreferenceContext);
  if (!context) {
    throw new Error(
      "useUnitPreferenceContext must be used within a UnitPreferenceProvider"
    );
  }
  return context;
};
