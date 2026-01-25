import React from "react";
import { ScreenWrapper } from "../components/layout/ScreenWrapper";
import { EntryForm } from "../components/features/EntryForm";
import { useEntriesContext, useUnitPreferenceContext } from "../context";

export const NewEntryScreen = () => {
  const { addEntry } = useEntriesContext();
  const { unit, setUnit } = useUnitPreferenceContext();

  return (
    <ScreenWrapper>
      <EntryForm unit={unit} setUnit={setUnit} onSubmit={addEntry} />
    </ScreenWrapper>
  );
};
