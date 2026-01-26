import React from "react";
import { DataProvider } from "./DataContext";
import { UnitPreferenceProvider } from "./UnitPreferenceContext";

/**
 * Root provider that wraps all context providers for the app
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const AppProvider = ({ children }) => {
  return (
    <DataProvider>
      <UnitPreferenceProvider>{children}</UnitPreferenceProvider>
    </DataProvider>
  );
};
