import React from "react";
import { ScreenWrapper } from "../components/layout/ScreenWrapper";
import { LogView } from "../components/features/log/LogView";
import { useEntriesContext, useUnitPreferenceContext } from "../context";

export const LogScreen = () => {
  const { entries, clearEntries } = useEntriesContext();
  const { unit } = useUnitPreferenceContext();

  return (
    <ScreenWrapper>
      <LogView entries={entries} unit={unit} onClearLog={clearEntries} />
    </ScreenWrapper>
  );
};
