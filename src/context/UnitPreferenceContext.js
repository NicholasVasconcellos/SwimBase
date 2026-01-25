import React, { createContext, useContext } from "react";
import { useUnitPreference } from "../hooks/useUnitPreference";

const UnitPreferenceContext = createContext(null);

export const UnitPreferenceProvider = ({ children }) => {
  const unitState = useUnitPreference();

  return (
    <UnitPreferenceContext.Provider value={unitState}>
      {children}
    </UnitPreferenceContext.Provider>
  );
};

export const useUnitPreferenceContext = () => {
  const context = useContext(UnitPreferenceContext);
  if (!context) {
    throw new Error(
      "useUnitPreferenceContext must be used within a UnitPreferenceProvider"
    );
  }
  return context;
};
