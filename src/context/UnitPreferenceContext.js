import React, { createContext, useContext } from "react";
import { useUnitPreference } from "../hooks/useUnitPreference";

// Make UnitPreference available globally, intially null
const UnitPreferenceContext = createContext(null);

// Set the Unit Preference
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

// Same as UseContext but with error check
export const useUnitPreferenceContext = () => {
  const context = useContext(UnitPreferenceContext);
  if (!context) {
    throw new Error(
      "useUnitPreferenceContext must be used within a UnitPreferenceProvider"
    );
  }
  return context;
};
