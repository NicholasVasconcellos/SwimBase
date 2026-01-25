import React from "react";
import { EntriesProvider } from "./EntriesContext";
import { UnitPreferenceProvider } from "./UnitPreferenceContext";

export const AppProvider = ({ children }) => {
  return (
    <EntriesProvider>
      <UnitPreferenceProvider>{children}</UnitPreferenceProvider>
    </EntriesProvider>
  );
};
