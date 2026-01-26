import React from "react";
import { EntriesProvider } from "./EntriesContext";
import { UnitPreferenceProvider } from "./UnitPreferenceContext";

/**
 * Root provider that wraps all context providers for the app
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The combined providers
 */
export const AppProvider = ({ children }) => {
  return (
    <EntriesProvider>
      <UnitPreferenceProvider>{children}</UnitPreferenceProvider>
    </EntriesProvider>
  );
};
